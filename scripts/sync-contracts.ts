import fs from "fs";
import path from "path";

// Paths
const PUBLISH_OUTPUT_PATH = path.join(process.cwd(), "publish_output.json");
const FRONTEND_CONFIG_PATH = path.join(process.cwd(), "frontend/lib/contracts.json");
const BACKEND_CONFIG_PATH = path.join(process.cwd(), "backend/src/config.json");

// Expected Module Names
const MODULE_NAMES = ["subscription", "vault", "mock_usdc"];

async function sync() {
    console.log("🔄 Syncing Smart Contract config...");

    if (!fs.existsSync(PUBLISH_OUTPUT_PATH)) {
        console.error("❌ publish_output.json not found. Run ./publish.sh first.");
        process.exit(1);
    }

    const rawOutput = fs.readFileSync(PUBLISH_OUTPUT_PATH, "utf-8");
    const jsonStartIndex = rawOutput.indexOf("{");
    const jsonEndIndex = rawOutput.lastIndexOf("}");

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        console.error("❌ Valid JSON not found in publish_output.json");
        process.exit(1);
    }

    const jsonString = rawOutput.substring(jsonStartIndex, jsonEndIndex + 1);
    const publishData = JSON.parse(jsonString);

    // 1. Extract Package ID
    // Look for the 'published' objectChange
    const publishedChange = publishData.objectChanges.find((c: any) => c.type === "published");
    if (!publishedChange) {
        console.error("❌ Could not find 'published' event in output.");
        process.exit(1);
    }
    const packageId = publishedChange.packageId;

    // 2. Extract Shared Objects (Registry, Vaults if any created in init?)
    // In our case, SubscriptionRegistry is created in init.
    // We look for 'created' objects where type matches our structs.

    let subscriptionRegistryId = "";
    let mockUsdcTreasuryId = "";
    let adminCapId = "";

    for (const change of publishData.objectChanges) {
        if (change.type === "created") {
            const type = change.objectType as string;

            if (type.includes("::subscription::SubscriptionRegistry")) {
                subscriptionRegistryId = change.objectId;
            }
            if (type.includes("::mock_usdc::MOCK_USDC")) { // TreasuryCap usually
                // Note: type for TreasuryCap is 0x2::coin::TreasuryCap<...>
                // We need to check if the inner type matches
                if (type.includes(packageId) && type.includes("mock_usdc")) {
                    mockUsdcTreasuryId = change.objectId;
                }
            }
            if (type.includes("::subscription::AdminCap")) {
                adminCapId = change.objectId;
            }
        }
    }

    if (!subscriptionRegistryId) console.warn("⚠️ Warning: SubscriptionRegistry not found created.");

    const configData = {
        testnet: {
            packageId,
            subscriptionRegistryId,
            mockUsdcTreasuryId,
            adminCapId, // Helpful for admin scripts
            modules: {
                subscription: "subscription",
                vault: "vault",
                mockUsdc: "mock_usdc"
            }
        }
    };

    const fileContent = JSON.stringify(configData, null, 4);

    // Write Frontend
    fs.mkdirSync(path.dirname(FRONTEND_CONFIG_PATH), { recursive: true });
    fs.writeFileSync(FRONTEND_CONFIG_PATH, fileContent);
    console.log(`✅ Wrote to ${FRONTEND_CONFIG_PATH}`);

    // Update frontend/lib/contracts.ts Wrapper if needed
    // (Optional but good for DX: update the TS file to read from this JSON)
    const tsWrapperPath = path.join(process.cwd(), "frontend/lib/contracts.ts");
    const tsContent = `import contractData from "./contracts.json";

export const CONTRACTS = contractData;
export const CURRENT_NETWORK = "testnet";

export function getContractConfig() {
    return CONTRACTS[CURRENT_NETWORK];
}
`;
    fs.writeFileSync(tsWrapperPath, tsContent);
    console.log(`✅ Updated ${tsWrapperPath}`);

    // Write Backend
    fs.mkdirSync(path.dirname(BACKEND_CONFIG_PATH), { recursive: true });
    fs.writeFileSync(BACKEND_CONFIG_PATH, fileContent);
    console.log(`✅ Wrote to ${BACKEND_CONFIG_PATH}`);

    console.log("🚀 Sync Complete.");
}

sync();
