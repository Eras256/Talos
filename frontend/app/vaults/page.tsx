"use client";

import { Wallet, TrendingUp, ShieldCheck, Activity, ArrowUpRight, Plus, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { getContractConfig } from "@/lib/contracts";

export default function VaultsPage() {
    const account = useCurrentAccount();
    const config = getContractConfig();
    const client = useSuiClient();

    // 1. Fetch OwnerCaps owned by the current user
    const { data: ownerCaps, isLoading: capsLoading } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: account?.address || "",
            filter: {
                StructType: `${config.packageId}::vault::OwnerCap`,
            },
            options: {
                showContent: true,
            },
        },
        {
            enabled: !!account,
        }
    );

    // 2. Extract Vault IDs from OwnerCaps
    const vaultIds = ownerCaps?.data?.map((obj: any) => {
        const content = obj.data?.content;
        if (content?.dataType === "moveObject") {
            // @ts-ignore - Dynamic field access
            return content.fields.vault_id as string;
        }
        return null;
    }).filter((id: string | null): id is string => !!id) || [];

    // 3. Fetch actual Vault objects
    const { data: vaultsData, isLoading: vaultsLoading } = useSuiClientQuery(
        "multiGetObjects",
        {
            ids: vaultIds,
            options: {
                showContent: true,
            }
        },
        {
            enabled: vaultIds.length > 0,
        }
    );

    const isLoading = capsLoading || vaultsLoading;

    // Process Vault Data for UI
    const vaults = vaultsData?.map((obj: any) => {
        const content = obj.data?.content;
        if (content?.dataType === "moveObject") {
            // @ts-ignore - Dynamic field access
            const fields = content.fields as any;
            return {
                id: fields.id.id,
                name: fields.name as string,
                strategy: "Custom Strategy", // Placeholder as strategy is not stored on Vault struct yet
                balance: "0.00 SUI", // Placeholder, would need to inspect Bag contents
                pnl: "0.0%", // Placeholder
                status: (fields.is_frozen ? "Frozen" : "Active"),
                lastAction: "Synced with network",
                time: "Just now"
            };
        }
        return null;
    }).filter((v: any) => !!v) || [];

    if (!account) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <GlassCard className="p-12 flex flex-col items-center">
                    <Wallet className="w-16 h-16 text-white/20 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h2>
                    <p className="text-white/60">Please connect your wallet to view your vaults.</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-mono font-bold tracking-tighter text-white mb-2">
                        My Vaults
                    </h1>
                    <p className="text-white/60 text-lg">
                        Manage your non-custodial agent accounts.
                    </p>
                </div>

                <Link
                    href="/marketplace"
                    className="px-6 py-3 bg-white text-obsidian font-bold rounded-lg hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    <Plus className="w-5 h-5" /> Deploy New Vault
                </Link>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Value Locked" value={`${vaults.length > 0 ? "..." : "0.00"} SUI`} icon={<Wallet className="w-5 h-5" />} />
                <StatCard label="Net APY (Weighted)" value="0.0%" icon={<TrendingUp className="w-5 h-5" />} highlighted />
                <StatCard label="Active Agents" value={`${vaults.length} / ${vaults.length}`} icon={<ShieldCheck className="w-5 h-5" />} />
            </div>

            {/* VAULTS LIST */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neural-500" /> Active Operations
                </h3>

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                    </div>
                )}

                {!isLoading && vaults.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                        <p className="text-white/40">No vaults found. Deploy one from the Marketplace.</p>
                    </div>
                )}

                {vaults.map((vault: any) => (
                    <GlassCard key={vault.id} className="group">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row lg:items-center gap-6 justify-between">

                            {/* Info */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-neural-500 transition-colors">
                                        {vault.name}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-xs border uppercase tracking-wide ${vault.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {vault.status}
                                    </span>
                                </div>
                                <div className="text-white/50 text-sm font-mono flex items-center gap-4">
                                    <span title={vault.id}>ID: {vault.id.slice(0, 6)}...{vault.id.slice(-4)}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{vault.strategy}</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-8 md:gap-12 min-w-[300px]">
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Balance</p>
                                    <p className="text-xl text-white font-mono">{vault.balance}</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-1">PnL</p>
                                    <p className="text-xl text-green-400 font-mono">{vault.pnl}</p>
                                </div>
                            </div>

                            {/* Action / Log */}
                            <div className="flex flex-col items-end gap-2 text-right border-l border-white/5 pl-6 min-w-[200px]">
                                <div className="text-xs text-white/40 italic">
                                    "{vault.lastAction}"
                                </div>
                                <div className="text-xs text-white/20">
                                    {vault.time}
                                </div>
                                <button className="mt-2 text-sm text-neural-500 hover:text-white flex items-center gap-1 transition-colors">
                                    Manage <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>

                        </div>
                    </GlassCard>
                ))}
            </div>

        </div>
    );
}

function StatCard({ label, value, icon, highlighted = false }: { label: string, value: string, icon: any, highlighted?: boolean }) {
    return (
        <GlassCard className={`${highlighted ? "bg-neural-900/20 border-neural-500/30" : ""}`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-white/40 text-sm font-medium uppercase tracking-wider">{label}</span>
                    <div className="p-2 bg-white/5 rounded-lg text-white/60">
                        {icon}
                    </div>
                </div>
                <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                    {value}
                </div>
            </div>
        </GlassCard>
    );
}
