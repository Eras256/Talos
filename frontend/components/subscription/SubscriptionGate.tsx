"use client";

import { useEffect, useState } from "react";
import { Lock, Zap, Loader2, CheckCircle2, Star, Shield, Crown } from "lucide-react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getContractConfig } from "@/lib/contracts"; // Make sure this path is correct
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface SubscriptionCheckProps {
    children: React.ReactNode;
    requiredTier?: number; // 1 = Hobbyist, 2 = Pro, 3 = Whale
}

const TIERS = [
    { id: 1, name: "Hobbyist", price: 5, icon: Star, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { id: 2, name: "Pro", price: 25, icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { id: 3, name: "Whale", price: 150, icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" }
];

export default function SubscriptionGate({ children, requiredTier = 1 }: SubscriptionCheckProps) {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const config = getContractConfig();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const router = useRouter();
    const { showToast } = useToast();

    const [userTier, setUserTier] = useState<number>(0); // 0 = None
    const [expiration, setExpiration] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [processingTier, setProcessingTier] = useState<number | null>(null);

    useEffect(() => {
        async function checkSubscription() {
            if (!account?.address || !config.subscriptionRegistryId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                // 1. Get Table ID from Registry
                const registryObj = await client.getObject({
                    id: config.subscriptionRegistryId,
                    options: { showContent: true }
                });

                if (registryObj.data?.content?.dataType !== "moveObject") {
                    setLoading(false);
                    return;
                }

                // @ts-ignore
                const tableId = registryObj.data.content.fields.subscribers.fields.id.id;

                // 2. Lookup User in Table
                try {
                    const subscriptionField = await client.getDynamicFieldObject({
                        parentId: tableId,
                        name: {
                            type: "address",
                            value: account.address
                        }
                    });

                    if (subscriptionField.data?.content?.dataType === "moveObject") {
                        // Struct: { tier: u8, expiration_ms: u64 }
                        // @ts-ignore
                        const fields = subscriptionField.data.content.fields.value.fields;

                        const exp = Number(fields.expiration_ms);
                        const tier = Number(fields.tier);

                        if (exp > Date.now()) {
                            setExpiration(exp);
                            setUserTier(tier);
                        } else {
                            setUserTier(0); // Expired
                        }
                    }
                } catch (e) {
                    // Not found
                    setUserTier(0);
                }

            } catch (e) {
                console.error("Subscription check failed:", e);
            } finally {
                setLoading(false);
            }
        }

        checkSubscription();
    }, [account?.address, client, config.subscriptionRegistryId]);

    const handleSubscribe = async (tierId: number, price: number) => {
        if (!account) return;
        setProcessingTier(tierId);

        try {
            const tx = new Transaction();
            // Handle decimal prices (e.g. 0.5 SUI) by multiplying by 1,000,000,000 (MIST per SUI)
            const priceMist = BigInt(Math.round(price * 1_000_000_000));

            // 1. Split Coin
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist)]);

            // 2. Call Subscribe
            // public fun subscribe(registry, clock, tier, payment, ctx)
            tx.moveCall({
                target: `${config.packageId}::subscription::subscribe`,
                arguments: [
                    tx.object(config.subscriptionRegistryId!),
                    tx.object("0x6"), // Clock
                    tx.pure.u8(tierId),
                    coin
                ]
            });

            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        const effects = result.effects as any;
                        const statusVal = effects?.status;
                        // Handle both string 'failure' and object { status: 'failure' }
                        const isFailure = statusVal === 'failure' || statusVal?.status === 'failure';

                        if (isFailure) {
                            const errorMsg = (statusVal && typeof statusVal === 'object' && statusVal.error)
                                ? statusVal.error
                                : "Execution failed on chain.";

                            showToast({
                                type: 'error',
                                title: "Transaction Failed",
                                message: errorMsg,
                            });
                            setProcessingTier(null);
                            return;
                        }

                        // Optimistic update
                        setUserTier(tierId);
                        setExpiration(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
                        setIsPricingOpen(false);
                        setProcessingTier(null);

                        showToast({
                            type: 'success',
                            title: `Welcome to Tier ${tierId}!`,
                            message: "Subscription activated successfully. Redirecting...",
                            txDigest: result.digest,
                            duration: 5000
                        });

                        // Redirect to Dashboard after delay
                        setTimeout(() => {
                            router.push("/dashboard");
                        }, 3000);
                    },
                    onError: (e) => {
                        console.error(e);
                        showToast({
                            type: 'error',
                            title: "Subscription Failed",
                            message: e.message || "Unknown error occurred",
                        });
                        setProcessingTier(null);
                    }
                }
            );

        } catch (e: any) {
            console.error("Build failed:", e);
            showToast({
                type: 'error',
                title: "Transaction Build Failed",
                message: e.message,
            });
            setProcessingTier(null);
        }
    };

    // --- RENDER STATES ---

    if (loading) {
        return (
            <div className="p-8 rounded-xl border border-white/5 bg-white/5 animate-pulse flex justify-center">
                <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
            </div>
        );
    }

    // Access Granted? (User Tier >= Required Tier)
    if (userTier >= requiredTier) {
        return <>{children}</>;
    }

    // --- LOCK OVERLAY ---
    return (
        <div className="relative group h-full">
            {/* Blurred Content */}
            <div className="blur opacity-30 pointer-events-none h-full select-none grayscale">
                {children}
            </div>

            {/* Lock UI */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                <div className="bg-obsidian/90 backdrop-blur-xl border border-neural-500/30 p-4 md:p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-auto">
                    <div className="w-12 h-12 rounded-full bg-neural-500/10 flex items-center justify-center mx-auto mb-4 border border-neural-500/20">
                        <Lock className="w-6 h-6 text-neural-400" />
                    </div>

                    <h3 className="text-white font-bold text-lg">
                        {requiredTier === 3 ? "Whale Access Required" : requiredTier === 2 ? "Pro Access Required" : "Subscription Required"}
                    </h3>

                    <p className="text-sm text-white/50 mt-2 mb-6">
                        This strategy requires a <strong>Tier {requiredTier}</strong> subscription or higher.
                    </p>

                    <button
                        onClick={() => setIsPricingOpen(true)}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4 fill-black" />
                        View Plans
                    </button>
                </div>
            </div>

            {/* Pricing Modal */}
            <AnimatePresence>
                {isPricingOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-obsidian border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-2xl font-bold text-white">Choose Your Access Level</h2>
                                <button onClick={() => setIsPricingOpen(false)} className="text-white/40 hover:text-white">Close</button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
                                {TIERS.map((tier) => {
                                    const Icon = tier.icon;
                                    const isCurrent = userTier === tier.id;
                                    const isRecommended = tier.id === requiredTier;

                                    return (
                                        <div
                                            key={tier.id}
                                            className={`relative flex flex-col p-6 rounded-xl border transition-all ${isRecommended ? 'border-neural-500 bg-neural-500/5 ring-2 ring-neural-500/20' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                                        >
                                            {isRecommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-neural-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">Required</div>}

                                            <div className={`w-12 h-12 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center mb-4`}>
                                                <Icon className={`w-6 h-6 ${tier.color}`} />
                                            </div>

                                            <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-2 mb-6">
                                                <span className="text-3xl font-bold text-white">{tier.price}</span>
                                                <span className="text-sm text-white/50">SUI / mo</span>
                                            </div>

                                            <div className="mt-auto">
                                                {isCurrent ? (
                                                    <div className="w-full py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2 font-bold cursor-default">
                                                        <CheckCircle2 className="w-5 h-5" /> Active
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSubscribe(tier.id, tier.price)}
                                                        disabled={!!processingTier}
                                                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                                                            ${processingTier
                                                                ? "bg-white/5 text-white/30"
                                                                : "bg-white text-black hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {processingTier === tier.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
