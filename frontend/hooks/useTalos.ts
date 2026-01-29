import { useCallback, useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CONTRACTS } from "@/lib/contracts";

export const useTalos = () => {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [tier, setTier] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const checkSubscription = useCallback(async () => {
        if (!account?.address || !CONTRACTS.SUBSCRIPTION_REGISTRY) return;
        setIsLoading(true);
        try {
            const registry = await client.getObject({
                id: CONTRACTS.SUBSCRIPTION_REGISTRY,
                options: { showContent: true }
            });

            if (registry.data?.content?.dataType !== "moveObject") {
                setIsSubscribed(false);
                return;
            }

            // @ts-ignore
            const tableId = registry.data.content.fields.subscribers.fields.id.id;

            const field = await client.getDynamicFieldObject({
                parentId: tableId,
                name: { type: "address", value: account.address }
            });

            if (field.data?.content?.dataType === "moveObject") {
                // @ts-ignore
                const fields = field.data.content.fields.value.fields;
                const exp = Number(fields.expiration_ms);
                const isActive = exp > Date.now();
                setIsSubscribed(isActive);
                setTier(isActive ? Number(fields.tier) : 0);
            } else {
                setIsSubscribed(false);
                setTier(0);
            }
        } catch (e) {
            console.error("Failed to fetch subscription:", e);
            setIsSubscribed(false); // Default to false on error 
            setTier(0);
        } finally {
            setIsLoading(false);
        }
    }, [account, client]);

    useEffect(() => {
        checkSubscription();
    }, [checkSubscription]);

    /**
     * Subscribe to the SaaS Platform
     */
    const subscribe = async (tierId: number, priceSui: number) => {
        const tx = new Transaction();
        // 1 SUI = 1,000,000,000 MIST
        // IMPORTANT: Handle potentially fractional prices safely if passing float
        const priceMist = BigInt(Math.round(priceSui * 1_000_000_000));

        const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist)]);

        tx.moveCall({
            target: `${CONTRACTS.PACKAGE_ID}::${CONTRACTS.MODULES.SUBSCRIPTION}::subscribe`,
            arguments: [
                tx.object(CONTRACTS.SUBSCRIPTION_REGISTRY!),
                tx.object("0x6"), // Clock
                tx.pure.u8(tierId),
                payment
            ]
        });

        const result = await signAndExecuteTransaction({ transaction: tx });
        await checkSubscription(); // Refresh status
        return result;
    };

    /**
     * Deploy a Smart Vault (Atomic PTB)
     */
    const deployVault = async (name: string) => {
        const tx = new Transaction();
        const WORKER_ADDRESS = "0x8ce5e3a1cc5b8be074c9820659b6dcae18210f350f46fcb10e32bc6327ad5884"; // Hardcoded for Demo

        const [ownerCap, agentCap] = tx.moveCall({
            target: `${CONTRACTS.PACKAGE_ID}::${CONTRACTS.MODULES.VAULT}::create_vault`,
            arguments: [tx.pure.string(name)]
        });

        tx.transferObjects([ownerCap], tx.pure.address(account?.address!));
        tx.transferObjects([agentCap], tx.pure.address(WORKER_ADDRESS));

        return signAndExecuteTransaction({ transaction: tx });
    };

    /**
     * Testnet Only: Mint Mock USDC
     */
    const mintMockUSDC = async () => {
        if (!CONTRACTS.MOCK_USDC_TREASURY) return;

        const tx = new Transaction();
        const amount = 1000 * 1_000_000; // 1000 USDC (6 decimals)

        tx.moveCall({
            target: `${CONTRACTS.PACKAGE_ID}::${CONTRACTS.MODULES.MOCK_USDC}::mint`,
            arguments: [
                tx.object(CONTRACTS.MOCK_USDC_TREASURY),
                tx.pure.u64(amount),
                tx.pure.address(account?.address!),
            ]
        });

        return signAndExecuteTransaction({ transaction: tx });
    }

    return {
        isSubscribed,
        tier,
        isLoading,
        checkSubscription,
        subscribe,
        deployVault,
        mintMockUSDC
    };
};
