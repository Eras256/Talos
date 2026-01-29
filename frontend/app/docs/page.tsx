"use client";

import { motion } from "framer-motion";
import { Book, Code, Shield, Cpu, FileText } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                <p className="text-white/50 max-w-2xl mx-auto">
                    Technical specifications, smart contract addresses, and integration guides for the Talos Protocol.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocCard
                    title="Smart Contracts"
                    icon={Code}
                    desc="View verified contract addresses on Sui Explorer."
                    link="https://suiexplorer.com"
                />
                <DocCard
                    title="Security Model"
                    icon={Shield}
                    desc="Understanding the Hot Potato and Flash Receipt pattern."
                    link="#"
                />
                <DocCard
                    title="Agent Architecture"
                    icon={Cpu}
                    desc="How the off-chain worker interacts with the 7K Aggregator."
                    link="#"
                />
                <DocCard
                    title="Legal Framework"
                    icon={FileText}
                    desc="Non-custodial terms and Mexican FinTech compliance."
                    link="#"
                />
            </div>

            <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Book className="w-6 h-6 text-neural-500" /> API Reference
                </h2>
                <div className="space-y-4 font-mono text-sm">
                    <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-green-400">GET /api/v1/vaults/:id/performance</p>
                        <p className="text-white/50 mt-1">Returns historical PnL and trade history.</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-blue-400">POST /api/v1/subscription/verify</p>
                        <p className="text-white/50 mt-1">Checks user tier against on-chain registry.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DocCard({ title, icon: Icon, desc, link }: any) {
    return (
        <a href={link} target="_blank" rel="noreferrer" className="block group">
            <div className="h-full bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neural-500/50 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-lg bg-neural-500/10 flex items-center justify-center border border-neural-500/20 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-neural-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-neural-300 transition-colors">{title}</h3>
                <p className="text-sm text-white/50">{desc}</p>
            </div>
        </a>
    )
}
