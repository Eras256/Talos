import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import dotenv from "dotenv";

dotenv.config();

// --- CONFIG ---
const NETWORK = (process.env.NETWORK as "testnet" | "mainnet") || "testnet";
const RPC_URL = process.env.SUI_NODE_URL || getFullnodeUrl(NETWORK);
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const COLD_WALLET_ADDRESS = process.env.COLD_WALLET_ADDRESS;

import fs from "fs";
import path from "path";

// LOAD FROM CONFIG FILES
const CONFIG_PATH = path.join(process.cwd(), "backend/src/config.json");
if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("Config not found. Run sync-contracts.ts first.");
}
const configRaw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
const config = configRaw.testnet; // Assumptions testnet for now

const PACKAGE_ID = config.packageId;
const SUBSCRIPTION_REGISTRY_ID = config.subscriptionRegistryId;
const ADMIN_CAP_ID = config.adminCapId;

if (!ADMIN_SECRET_KEY || !COLD_WALLET_ADDRESS) {
    console.error("Error: Missing env vars (ADMIN_SECRET_KEY, COLD_WALLET_ADDRESS)");
    process.exit(1);
}

const client = new SuiClient({ url: RPC_URL });

async function withdraw() {
    // Setup Signer
    const { schema, secretKey } = decodeSuiPrivateKey(ADMIN_SECRET_KEY!);
    if (schema !== "ED25519") throw new Error("Only ED25519 keys supported");
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const adminAddr = keypair.toSuiAddress();

    console.log(`[ADMIN] Withdrawing funds...`);
    console.log(`[Signer] ${adminAddr}`);
    console.log(`[Target] ${COLD_WALLET_ADDRESS}`);

    const tx = new Transaction();

    // Move Call: talos::subscription::withdraw
    const [coin] = tx.moveCall({
        target: `${PACKAGE_ID}::subscription::withdraw`,
        arguments: [
            tx.object(SUBSCRIPTION_REGISTRY_ID!), // Registry
            tx.object(ADMIN_CAP_ID)  // AdminCap (You must also have this ID)
        ]
    });

    // Transfer to Cold Wallet
    tx.transferObjects([coin], tx.pure.address(COLD_WALLET_ADDRESS!));

    // Execute
    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: {
            showEffects: true,
            showObjectChanges: true
        }
    });

    if (result.effects?.status.status === "success") {
        console.log(`[SUCCESS] Funds withdrawn!`);
        console.log(`[Digest] ${result.digest}`);
    } else {
        console.error(`[FAILURE] Withdrawal failed: ${result.effects?.status.error}`);
    }
}

withdraw().catch(console.error);
