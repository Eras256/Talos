"use client";

import { useTalos } from "@/hooks/useTalos";
import { Lock, Zap, Star, Shield, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useState } from "react";

// SUBSCRIPTION TIERS DATA
const TIERS = [
    {
        id: 1,
        name: "Hobbyist",
        price: 5,
        icon: Star,
        color: "text-blue-400",
        bg: "from-blue-500/20 to-transparent",
        border: "border-blue-500/30",
        features: ["Access to Basic Vaults", "Daily Execution Limits", "Standard Support"]
    },
    {
        id: 2,
        name: "Pro",
        price: 25,
        icon: Shield,
        color: "text-purple-400",
        bg: "from-purple-500/20 to-transparent",
        border: "border-purple-500/30",
        features: ["Access to Pro Vaults", "Hourly Execution", "Priority Support", "7K Aggregator Access"]
    },
    {
        id: 3,
        name: "Whale",
        price: 150,
        icon: Crown,
        color: "text-amber-400",
        bg: "from-amber-500/20 to-transparent",
        border: "border-amber-500/30",
        features: ["Unlimited Vaults", "Real-time Execution", "Dedicated Account Manager", "Custom Strategy Logic"]
    }
];

export default function SubscriptionGate({ children }: { children: React.ReactNode }) {
    const { isSubscribed, isLoading, subscribe } = useTalos();
    const account = useCurrentAccount();
    const [submittingTier, setSubmittingTier] = useState<number | null>(null);

    const handleSubscribe = async (tierId: number, price: number) => {
        if (!account) return;
        setSubmittingTier(tierId);
        try {
            await subscribe(tierId, price);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmittingTier(null);
        }
    };

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 animate-float">
                    <Lock className="w-8 h-8 text-white/50" />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                    Connect Wallet to Access
                </h2>
                <p className="text-white/50 max-w-md mx-auto">
                    Securely connect your Sui wallet to view your vaults and subscription status.
                </p>
                <div className="scale-125">
                    <ConnectButton />
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-neural-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-neural-300 animate-pulse">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (isSubscribed) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Choose Your <span className="text-neural-500">Access Level</span>
                </h2>
                <p className="text-lg text-white/50">
                    Unlock the full power of Talos AgentFi. Prices are denominated in SUI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {TIERS.map((tier) => (
                    <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: tier.id * 0.1 }}
                        className={`relative group bg-obsidian border ${tier.border} rounded-2xl p-8 overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl`}
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${tier.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className={`w-12 h-12 rounded-lg ${tier.color} bg-white/5 border border-white/10 flex items-center justify-center mb-6`}>
                                <tier.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-mono font-bold text-white">{tier.price}</span>
                                <span className="text-sm text-white/50">SUI / mo</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tier.color.replace('text-', 'bg-')}`} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(tier.id, tier.price)}
                                disabled={submittingTier === tier.id}
                                className={`w-full py-4 rounded-xl font-bold text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group-hover:bg-neural-600 group-hover:border-transparent`}
                            >
                                {submittingTier === tier.id ? (
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Subscribe <Zap className="w-4 h-4 fill-current" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
