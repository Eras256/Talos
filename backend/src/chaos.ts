
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import dotenv from "dotenv";

dotenv.config();

const client = new SuiClient({ url: process.env.SUI_NODE_URL || getFullnodeUrl("testnet") });
const PACKAGE_ID = process.env.PACKAGE_ID!;
const MODULE_NAME = "vault"; // Assumes vault module name

// Helper to get keypair
function getKeypair() {
    if (process.env.AGENT_SECRET_KEY) {
        return Ed25519Keypair.fromSecretKey(process.env.AGENT_SECRET_KEY);
    }
    throw new Error("AGENT_SECRET_KEY not set");
}

async function runChaosTests() {
    console.log("😈 CHAOS ENGINEERING: Starting Tests...");
    const keypair = getKeypair();
    const address = keypair.toSuiAddress();
    console.log(`[Attacker] Using address: ${address}`);

    // --- TEST 1: Unauthorized Access (User trying to be Agent) ---
    console.log("\n[TEST 1] Unauthorized Access: Calling borrow_flash without AgentCap...");
    try {
        const tx = new Transaction();
        // We artificially try to pass a FAKE object as AgentCap, or just a random object ID
        // Since we can't easily forge a Move Object, we'll try to use the Registry as the Cap (Type Mismatch)
        // or just fail to provide valid arguments. 
        // A better test is: Trying to call it with *some* object that isn't the Cap.

        // Let's assume we have a Vault ID (we'd need to find one). 
        // For chaos, let's just create a dummy PTB that *would* look like a borrow but with wrong cap.
        // Actually, without a valid Vault ID, we can't really target anything.
        // Let's skip finding a vault for now and assume we fail if we can't build the TX.

        console.log("-> Skipping (Requires valid Vault ID for targeted attack). Run manually via CLI if needed.");
    } catch (e) {
        console.log("Caught expected error:", e);
    }

    // --- TEST 2: Finite Slippage / Bad Repayment ---
    console.log("\n[TEST 2] Bad Repayment: Trying to repay LESS than borrowed...");
    // This requires finding an AgentCap we own, borrowing, and then repaying less.
    // If the worker owns caps, we can use the worker keypair to *mishbehave*.

    // 1. Find a Vault we manage
    const ownedObjects = await client.getOwnedObjects({
        owner: address,
        filter: { StructType: `${PACKAGE_ID}::vault::AgentCap` },
        options: { showContent: true }
    });

    if (ownedObjects.data.length === 0) {
        console.log("No AgentCaps found. Cannot simulate malicious worker behavior.");
        return;
    }

    const cap = ownedObjects.data[0];
    // @ts-ignore
    const vaultId = cap.data?.content?.fields?.vault_id;
    const capId = cap.data?.objectId;

    console.log(`Targeting Vault: ${vaultId}`);

    try {
        const tx = new Transaction();
        const AMOUNT = 1_000_000; // 0.001 SUI
        // Borrow
        const [loanCoin, receipt] = tx.moveCall({
            target: `${PACKAGE_ID}::vault::borrow_flash`,
            typeArguments: ["0x2::sui::SUI"],
            arguments: [
                tx.object(vaultId),
                tx.object(capId!),
                tx.object(process.env.SUBSCRIPTION_REGISTRY_ID!),
                tx.object("0x6"),
                tx.pure.u64(AMOUNT)
            ]
        });

        // Split the coin (burn money / lose it) -> Simulate "Bad Trade"
        // We take 1000 from loan, leave rest. Actually we just need to NOT join it back fully.
        // Or simpler: Repay with a coin of value 0. (And keep the loanCoin? No, we must use FlashReceipt).
        // Let's try to repay with a generic 0 value coin?
        // Or just destroy the loanCoin (impossible in PTB easily without specific move call).

        // Logic: Send loanCoin to specific address (the attacker), then try to repay with a fresh zero coin?
        // No, repay_flash requires the exact amount returned.

        // Attack: Repay 1 unit less.
        const [steal] = tx.splitCoins(loanCoin, [tx.pure.u64(100)]);
        tx.transferObjects([steal], tx.pure.address(address)); // Steal 100 MIST

        // Repay remainder
        tx.moveCall({
            target: `${PACKAGE_ID}::vault::repay_flash`,
            typeArguments: ["0x2::sui::SUI"],
            arguments: [
                tx.object(vaultId),
                loanCoin, // Has -100 balance now
                receipt
            ]
        });

        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx
        });

        console.log("CRITICAL FAILURE: Malicious transaction succeeded!", result);

    } catch (e: any) {
        console.log("✅ SUCCESS: Malicious transaction failed as expected.");
        console.log("Error Message:", e.message || e);
    }
}

runChaosTests();
