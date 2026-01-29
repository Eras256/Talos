import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import dotenv from "dotenv";

dotenv.config();

// --- CONFIGURATION ---
const RPC_URL = process.env.SUI_NODE_URL || getFullnodeUrl("testnet");
// These should ideally be loaded from contracts.json or env, but hardcoding provided IDs for structure
const PACKAGE_ID = process.env.PACKAGE_ID || "0xfa11477e99c052118b4ddb687572ca144501691dcbfaddf80ec953d54d797270";
const SUBSCRIPTION_REGISTRY_ID = process.env.SUBSCRIPTION_REGISTRY_ID || "0x74ab07facc0d3f44be059a6283edb7ed37cabdcf85f78e0fc240d03a71a477d8";
const MODULE_NAME = "vault";
const CLOCK_OBJECT_ID = "0x6";
const AGENT_CAP_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::AgentCap`;
const TESTNET_MODE = process.env.TESTNET_MODE === "true"; // TOGGLE

// --- SETUP ---
if (!process.env.AGENT_SECRET_KEY) {
    console.error("FATAL: AGENT_SECRET_KEY missing.");
    process.exit(1);
}

const { schema, secretKey } = decodeSuiPrivateKey(process.env.AGENT_SECRET_KEY);
if (schema !== "ED25519") throw new Error("Only Ed25519 keys supported");
const keypair = Ed25519Keypair.fromSecretKey(secretKey);
const agentAddress = keypair.toSuiAddress();
const client = new SuiClient({ url: RPC_URL });

console.log(`[TALOS AGENT] Initialized: ${agentAddress}`);
console.log(`[MODE] ${TESTNET_MODE ? "TESTNET (Mock Swaps)" : "MAINNET (Real Aggregation)"}`);

// --- TYPES ---
interface AgentJob {
    capId: string;
    vaultId: string;
}

// --- LOGIC ---

/**
 * MOCK AGGREGATOR INTEGRATION
 * In production, this would call 7k or Hop Aggregator API to get a route.
 */
async function getBestSwapRoute(amountIn: bigint, coinIn: string, coinOut: string) {
    if (TESTNET_MODE) {
        return {
            amountOutEstim: amountIn + 1000n,
            txBytes: null
        };
    }

    // REAL Aggregation Logic (Stub for Mainnet)
    try {
        console.log("Fetching route from 7K Aggregator...");
        // const quote = await fetch(`https://api.7k.ag/quote?amount=${amountIn}...`);
        // return quote;
        throw new Error("Aggegator API not configured for Mainnet yet.");
    } catch (e) {
        return null;
    }
}

/**
 * Execute the Flash Loan Strategy
 */
async function executeStrategy(job: AgentJob) {
    try {
        const tx = new Transaction();
        const AMOUNT_TO_BORROW = 1_000_000_000n; // 1 SUI

        // 1. Borrow Flash (SUI)
        // returns [Coin<SUI>, FlashReceipt]
        const [borrowedCoin, receipt] = tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::borrow_flash`,
            typeArguments: ["0x2::sui::SUI"],
            arguments: [
                tx.object(job.vaultId),
                tx.object(job.capId),
                tx.pure.u64(AMOUNT_TO_BORROW),
                tx.object(SUBSCRIPTION_REGISTRY_ID),
                tx.object(CLOCK_OBJECT_ID)
            ]
        });

        // 2. EXECUTE SWAP (THE MEAT)
        if (TESTNET_MODE) {
            // MOCK: Do nothing. Holding the coin is enough to repay it.
            // We simulate "profit" by just assuming we have enough (or if strictly required, we'd need to mint more coin).
            console.log(`[TESTNET] Skipping real swap. Returning funds directly.`);
        } else {
            // MAINNET: Inject Aggregator PTB commands here
            console.log("[MAINNET] Attempting real swap...");
        }

        // 3. Repay Flash
        // Must return at least AMOUNT_TO_BORROW. 
        // If our swap failed to generate profit, this transaction aborts (Atomic Safety).
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::repay_flash`,
            typeArguments: ["0x2::sui::SUI"],
            arguments: [
                tx.object(job.vaultId),
                borrowedCoin, // In real flow: sui_back from swap
                receipt
            ]
        });

        tx.setGasBudget(10_000_000);

        // Sign and Execute
        const result = await client.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair,
            options: {
                showEffects: true,
                showEvents: true
            }
        });

        if (result.effects?.status.status === "success") {
            console.log(`[SUCCESS] Arbitrage Executed for Vault ${job.vaultId}. Digest: ${result.digest}`);
        } else {
            console.error(`[FAILURE] Execution reverted: ${result.effects?.status.error}`);
        }

    } catch (e: any) {
        console.error(`[EXEC ERROR] Vault ${job.vaultId}:`, e.message);
    }
}

// --- WORKER LOOP ---

async function fetchAssignedVaults(): Promise<AgentJob[]> {
    let hasNext = true;
    let cursor = null;
    const jobs: AgentJob[] = [];

    while (hasNext) {
        const res = await client.getOwnedObjects({
            owner: agentAddress,
            filter: { StructType: AGENT_CAP_TYPE },
            options: { showContent: true },
            cursor
        });

        for (const data of res.data) {
            if (data.data?.content?.dataType === "moveObject") {
                const fields = data.data.content.fields as any;
                jobs.push({
                    capId: data.data.objectId,
                    vaultId: fields.vault_id
                });
            }
        }
        hasNext = res.hasNextPage;
        cursor = res.nextCursor;
    }
    return jobs;
}

async function run() {
    console.log("[WORKER] Started. Polling for AgentCaps...");
    while (true) {
        const jobs = await fetchAssignedVaults();
        console.log(`[POLL] Found ${jobs.length} vaults.`);

        for (const job of jobs) {
            await executeStrategy(job);
        }

        await new Promise(r => setTimeout(r, 5000));
    }
}

run();
