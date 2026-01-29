"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Zap,
    Shield,
    Clock,
    Plus
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSubscription } from "@/hooks/useSubscription";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
    const account = useCurrentAccount();
    const { checkStatus, status, loading: subLoading } = useSubscription();

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Mock Data for Dashboard
    const stats = [
        { label: "Total Value Locked", value: "$0.00", change: "+0%", icon: Wallet },
        { label: "Active Vaults", value: "0", change: "0 active", icon: LayoutDashboard },
        { label: "24h Yield", value: "0.00 SUI", change: "+0%", icon: TrendingUp },
        { label: "Win Rate", value: "--", change: "N/A", icon: Activity },
    ];

    const recentActivity: any[] = [
        // { action: "Subscription Upgrade", date: "2 mins ago", status: "Completed" },
        // { action: "Vault Deployment", date: "1 day ago", status: "Success" },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-white/50 text-sm mt-1">
                        Welcome back, <span className="font-mono text-neural-400">{account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : "Guest"}</span>
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href="/marketplace" className="flex-1 md:flex-none">
                        <button className="w-full md:w-auto px-4 py-2 bg-neural-500 hover:bg-neural-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <Plus className="w-4 h-4" /> New Vault
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <GlassCard key={idx} className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neural-400">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 ${stat.change.includes('+') ? 'text-green-400' : 'text-white/40'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Active Strategies / Overview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Subscription Status Card */}
                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neural-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-neural-500/20 transition-all duration-700" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-neural-400" /> Subscription Status
                                </h3>
                                <button
                                    onClick={() => checkStatus()}
                                    className="text-white/40 hover:text-white transition-colors"
                                    title="Refresh Status"
                                >
                                    <Activity className={`w-4 h-4 ${subLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="mb-1 text-white/50 text-sm">Current Plan</div>
                                    <div className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        {subLoading ? (
                                            <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                                        ) : !account ? (
                                            <span className="text-white/40 text-2xl">Wallet Not Connected</span>
                                        ) : (
                                            <>
                                                {status.tier === 0 ? "No Active Plan" :
                                                    status.tier === 1 ? "Hobbyist" :
                                                        status.tier === 2 ? "Pro Agent" :
                                                            status.tier === 3 ? "Whale Alpha" : "Unknown"}

                                                {status.isActive && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                        Active
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-white/40 max-w-xs">
                                        {!account
                                            ? "Please connect your wallet to view your subscription details."
                                            : status.isActive
                                                ? `Your runtime access is valid for another ${status.daysRemaining} days.`
                                                : "Subscribe to unlock premium AI strategies and override standard rate limits."
                                        }
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {!account ? (
                                        <div className="w-full py-3 bg-white/5 text-white/50 border border-white/5 font-medium rounded-lg text-center cursor-not-allowed flex items-center justify-center gap-2">
                                            <Wallet className="w-4 h-4" /> Connect Wallet
                                        </div>
                                    ) : !status.isActive ? (
                                        <Link href="/pricing" className="w-full">
                                            <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                                <Zap className="w-4 h-4 fill-black" /> Upgrade Now
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/pricing" className="w-full">
                                            <button className="w-full py-3 bg-white/5 text-white border border-white/10 font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                                Manage Plan
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Operational Metrics (Placeholder) */}
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-neural-400" /> Live Operations
                            </h3>
                            <button className="text-xs text-white/40 hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-lg bg-white/2">
                            <div className="p-3 bg-white/5 rounded-full mb-3">
                                <LayoutDashboard className="w-6 h-6 text-white/20" />
                            </div>
                            <p className="text-white/40 font-medium">No active strategies running</p>
                            <Link href="/marketplace" className="text-neural-400 text-sm mt-2 hover:underline">
                                Deploy your first Vault →
                            </Link>
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar: Recent Activity / Notifications */}
                <div className="space-y-6">
                    <GlassCard className="p-6 h-full">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-neural-400" /> Recent Activity
                        </h3>

                        {recentActivity.length > 0 ? (
                            <ul className="space-y-4">
                                {recentActivity.map((item, i) => (
                                    <li key={i} className="py-3 border-b border-white/5 last:border-0">
                                        {/* Activity Item Mockup */}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-white/40 italic text-center py-8">
                                No recent on-chain activity.
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <QuickLink href="/vaults" label="My Vaults" />
                                <QuickLink href="/analytics" label="Global Analytics" />
                                <QuickLink href="/pricing" label="Upgrade Tier" />
                                <QuickLink href="https://docs.sui.io" label="Sui Documentation" external />
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function QuickLink({ href, label, external }: { href: string, label: string, external?: boolean }) {
    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            className="flex items-center justify-between p-3 rounded-lg bg-white/2 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
        >
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
            <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
        </Link>
    );
}
