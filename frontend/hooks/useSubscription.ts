import { useCallback, useState } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getContractConfig } from "@/lib/contracts";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export type TierId = 1 | 2 | 3;

export interface SubscriptionStatus {
    isActive: boolean;
    tier: number;
    expirationMs: number;
    daysRemaining: number;
}

export const useSubscription = () => {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const config = getContractConfig();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<SubscriptionStatus>({
        isActive: false,
        tier: 0,
        expirationMs: 0,
        daysRemaining: 0
    });

    /**
     * Checks subscription status using devInspect (Read-Only)
     * Note: Accessing Dynamic Fields directly is often more reliable than devInspect for simplistic table lookups,
     * but we'll implement a robust hybrid approach here.
     */
    const checkStatus = useCallback(async () => {
        if (!account?.address || !config.subscriptionRegistryId) return;
        setLoading(true);

        try {
            // 1. Get Table ID via Registry Object
            const registry = await client.getObject({
                id: config.subscriptionRegistryId,
                options: { showContent: true }
            });

            if (registry.data?.content?.dataType !== "moveObject") return;

            // @ts-ignore
            const tableId = registry.data.content.fields.subscribers.fields.id.id;

            // 2. Fetch Dynamic Field for User
            const field = await client.getDynamicFieldObject({
                parentId: tableId,
                name: { type: "address", value: account.address }
            });

            if (field.data?.content?.dataType === "moveObject") {
                // @ts-ignore
                const fields = field.data.content.fields.value.fields;
                const tier = Number(fields.tier);
                const expirationMs = Number(fields.expiration_ms);
                const now = Date.now();
                const isActive = expirationMs > now;
                const daysRemaining = isActive ? Math.ceil((expirationMs - now) / (1000 * 60 * 60 * 24)) : 0;

                setStatus({
                    isActive,
                    tier: isActive ? tier : 0,
                    expirationMs,
                    daysRemaining
                });
            } else {
                // Not found
                setStatus({ isActive: false, tier: 0, expirationMs: 0, daysRemaining: 0 });
            }

        } catch (e) {
            console.error("Failed to check subscription:", e);
        } finally {
            setLoading(false);
        }
    }, [account, client, config]);

    const { showToast } = useToast();

    /**
     * Executes the Subscribe Transaction
     */
    const subscribe = async (tier: TierId, priceSui: number) => {
        if (!account || !config.subscriptionRegistryId) {
            showToast({
                type: 'error',
                title: "Connection Error",
                message: "Wallet not connected or Contract Config missing."
            });
            return;
        }

        setSubmitting(true);
        try {
            const tx = new Transaction();
            const MIST_PER_SUI = BigInt("1000000000");
            const priceMist = BigInt(priceSui) * MIST_PER_SUI;

            // 1. Split Coin from Gas for precise payment
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist)]);

            // 2. Move Call to 'subscribe'
            tx.moveCall({
                target: `${config.packageId}::subscription::subscribe`,
                arguments: [
                    tx.object(config.subscriptionRegistryId),
                    tx.object("0x6"), // Clock
                    tx.pure.u8(tier),
                    coin
                ]
            });

            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        const statusVal = result.effects?.status as any;
                        const isFailure = statusVal === 'failure' || statusVal?.status === 'failure';

                        if (isFailure) {
                            const errorMsg = (typeof statusVal === 'object' && statusVal?.error)
                                ? statusVal.error
                                : "Execution failed on chain.";

                            showToast({
                                type: 'error',
                                title: "Transaction Failed",
                                message: errorMsg,
                            });
                            return;
                        }

                        console.log("Subscribed!", result);
                        showToast({
                            type: 'success',
                            title: `Welcome to Tier ${tier}!`,
                            message: "Subscription activated successfully. Redirecting...",
                            txDigest: result.digest,
                            duration: 5000
                        });

                        // Refresh status immediately
                        checkStatus();

                        // Redirect to Dashboard after delay
                        setTimeout(() => {
                            router.push("/dashboard");
                        }, 3000);
                    },
                    onError: (err) => {
                        console.error("Subscription failed:", err);
                        showToast({
                            type: 'error',
                            title: "Subscription Failed",
                            message: err.message || "Ensure you have enough SUI.",
                        });
                    },
                    onSettled: () => setSubmitting(false)
                }
            );
        } catch (e: any) {
            console.error("TX Build failed:", e);
            setSubmitting(false);
            showToast({
                type: 'error',
                title: "Transaction Error",
                message: e.message || "Failed to build transaction."
            });
        }
    };

    return {
        checkStatus,
        subscribe,
        status,
        loading,
        submitting
    };
};
