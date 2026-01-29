"use client";

import { useTalos } from "@/hooks/useTalos";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import { Plus, Coins, Activity, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CURRENT_NETWORK } from "@/lib/contracts";

export default function VaultView() {
    const { deployVault, mintMockUSDC } = useTalos();
    const account = useCurrentAccount();
    const [deploying, setDeploying] = useState(false);
    const [minting, setMinting] = useState(false);

    // MOCK DATA (In real app, fetch from Vault Object via useSuiClientQuery)
    // We demonstrate UI structure here since we don't have a specific vault ID yet without indexing.
    const vaults = [
        { id: "1", name: "Alpha Strategy", balance: "145.20", asset: "SUI", pnl: "+12.5%", status: "Active" },
        { id: "2", name: "Stable Yield", balance: "5,000.00", asset: "USDC", pnl: "+3.2%", status: "Idle" }
    ];

    const handleDeploy = async () => {
        setDeploying(true);
        try {
            await deployVault(`Vault-${Math.floor(Math.random() * 1000)}`);
            // In a real app, you'd invalidate queries here to show the new vault
        } catch (e) {
            console.error(e);
        } finally {
            setDeploying(false);
        }
    };

    const handleMint = async () => {
        setMinting(true);
        try {
            await mintMockUSDC();
        } catch (e) { console.error(e); }
        finally { setMinting(false); }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Your Vaults</h1>
                    <p className="text-white/50">Manage your autonomous capital.</p>
                </div>
                <div className="flex gap-3">
                    {CURRENT_NETWORK === 'testnet' && (
                        <button
                            onClick={handleMint}
                            disabled={minting}
                            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                        >
                            {minting ? "Minting..." : "Get Test USDC"} <Coins className="w-4 h-4 text-yellow-400" />
                        </button>
                    )}

                    <button
                        onClick={handleDeploy}
                        disabled={deploying}
                        className="px-6 py-2 bg-neural-500 hover:bg-neural-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-neural-500/20"
                    >
                        {deploying ? "Deploying..." : "New Vault"} <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard label="Total Value Locked" value="$5,145.20" icon={Wallet} trend="+5.4%" />
                <MetricCard label="Active Agents" value="1" icon={Activity} />
                <MetricCard label="Total PnL" value="+$420.69" icon={TrendingUp} trend="+12.4%" positive />
            </div>

            {/* Vault List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vaults.map((vault) => (
                    <motion.div
                        key={vault.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neural-500/30 transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-neural-500/10 flex items-center justify-center border border-neural-500/20">
                                    <Activity className="w-5 h-5 text-neural-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-neural-400 transition-colors">{vault.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${vault.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                                        {vault.status}
                                    </span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-white/40 mb-1">Balance</div>
                                <div className="text-xl font-mono text-white">{vault.balance} <span className="text-sm text-white/50">{vault.asset}</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-white/40 mb-1">PnL</div>
                                <div className="text-xl font-mono text-green-400">{vault.pnl}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, trend, positive }: any) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
                <div className="text-white/50 text-sm font-medium">{label}</div>
                <Icon className="w-5 h-5 text-white/30" />
            </div>
            <div className="flex items-end gap-3">
                <div className="text-2xl font-bold text-white font-mono">{value}</div>
                {trend && (
                    <div className={`text-xs font-bold mb-1 ${positive ? 'text-green-400' : 'text-neural-400'}`}>
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
}
