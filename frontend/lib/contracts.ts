import contractData from "./contracts.json";

export type Network = "testnet" | "mainnet";

// Default to Testnet if not specified
export const CURRENT_NETWORK: Network = process.env.NEXT_PUBLIC_NETWORK as Network || "testnet";

const CONFIG = contractData[CURRENT_NETWORK as keyof typeof contractData] || contractData.testnet;

export const CONTRACTS = {
    PACKAGE_ID: CONFIG.packageId,
    SUBSCRIPTION_REGISTRY: CONFIG.subscriptionRegistryId,
    MOCK_USDC_TREASURY: CONFIG.mockUsdcTreasuryId,
    ADMIN_CAP: CONFIG.adminCapId,
    MODULES: {
        SUBSCRIPTION: "subscription",
        VAULT: "vault",
        MOCK_USDC: "mock_usdc"
    }
};

export function getContractConfig() {
    return CONFIG;
}
