"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import SubscriptionGate from "@/components/subscription/SubscriptionGate";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getContractConfig } from "@/lib/contracts";

interface SkillCardProps {
    title: string;
    provider: string;
    apy: string;
    risk: "Low" | "Medium" | "High";
    description: string;
    tags: string[];
    isPro?: boolean;
}

const SKILLS: SkillCardProps[] = [
    {
        title: "Cetus Arbitrage v3",
        provider: "DeepSeek-DAO",
        apy: "12.4%",
        risk: "High",
        description: "Monitors pool imbalances between USDC-SUI and CETUS-SUI. Executes atomic flash swaps.",
        tags: ["Arbitrage", "DeFi", "Cetus"],
        isPro: true
    },
    {
        title: "DeepBook Market Maker",
        provider: "Talos Labs",
        apy: "8.1%",
        risk: "Medium",
        description: "Provides liquidity on DeepBook CLOB. Neutral strategy leveraging mean reversion.",
        tags: ["Market Making", "DeepBook"],
        isPro: false
    },
    {
        title: "Sui Liquid Staking Opt",
        provider: "Scallop Agents",
        apy: "4.5%",
        risk: "Low",
        description: "Auto-compounds staking rewards and rotates between LST providers for max yield.",
        tags: ["Staking", "Low Risk"],
        isPro: false
    }
];

export default function MarketplacePage() {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();

    const handleDeploy = async (skillName: string) => {
        if (!currentAccount) {
            alert("Please connect your wallet first.");
            return;
        }

        console.log(`Initializing deployment for ${skillName}...`);
        const config = getContractConfig();
        const tx = new Transaction();

        // 1. Call create_vault, returning [OwnerCap, AgentCap]
        const [ownerCap, agentCap] = tx.moveCall({
            target: `${config.packageId}::vault::create_vault`,
            arguments: [tx.pure.string(skillName)],
        });

        // 2. Transfer OwnerCap to the user (sender)
        tx.transferObjects([ownerCap], tx.pure.address(currentAccount.address));

        // 3. Transfer AgentCap to the Worker (Backend Service)
        // Ideally this comes from an env var or API, hardcoded for MVP
        const WORKER_ADDRESS = "0x8bd468b0e5941e75484e95191d99ff6234b2ab24e3b91650715b6df8cf8e4eba";
        tx.transferObjects([agentCap], tx.pure.address(WORKER_ADDRESS));

        signAndExecuteTransaction(
            {
                transaction: tx,
            },
            {
                onSuccess: (result: any) => {
                    console.log("Vault deployed & delegated:", result);
                    alert(`Vault Deployed & Delegated! Digest: ${result.digest}`);
                },
                onError: (err: any) => {
                    console.error("Deployment failed:", err);
                    alert("Deployment failed. See console for details.");
                }
            }
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-mono font-bold tracking-tighter text-white mb-4">
                    Skill Marketplace
                </h1>
                <p className="text-white/60 max-w-2xl text-lg">
                    Browse verified AI execution strategies. Deploy a non-custodial Vault and grant permissions to the agent.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SKILLS.map((skill, idx) => (
                    <GlassCard key={idx}>
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {skill.title}
                                    </h3>
                                    <p className="text-sm text-white/40 flex items-center gap-1 mt-1">
                                        by {skill.provider}
                                    </p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-mono uppercase bg-white/5 border border-white/10`}>
                                    {skill.risk}
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-3xl font-mono text-white tracking-tighter">{skill.apy}</span>
                                <span className="text-sm text-white/40 mb-1">Hist. APY</span>
                            </div>

                            <p className="text-sm text-white/50 mb-6 flex-grow">
                                {skill.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <SubscriptionGate requiredTier={skill.isPro ? 2 : 1}>
                                        <DeployButton onClick={() => handleDeploy(skill.title)} />
                                    </SubscriptionGate>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}

function DeployButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 bg-white/5 hover:bg-neural-500 hover:text-white border border-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
        >
            <Zap className="w-4 h-4 fill-white group-hover:fill-current" />
            Deploy Vault
        </button>
    );
}
