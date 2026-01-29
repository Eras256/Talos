"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import { TrendingUp, Users, Activity, DollarSign } from "lucide-react";

// Mock Data for Charts
const DATA = [
    { name: 'Jan', tvl: 4000, users: 240 },
    { name: 'Feb', tvl: 3000, users: 138 },
    { name: 'Mar', tvl: 6000, users: 900 },
    { name: 'Apr', tvl: 8700, users: 1108 },
    { name: 'May', tvl: 12900, users: 1800 },
    { name: 'Jun', tvl: 18000, users: 2400 },
    { name: 'Jul', tvl: 24000, users: 3100 },
];

export default function AnalyticsPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="mb-12">
                <h1 className="text-4xl font-mono font-bold tracking-tighter text-white mb-2">
                    Network Analytics
                </h1>
                <p className="text-white/60 text-lg">
                    Real-time insights into the Talos Execution Runtime.
                </p>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <KpiCard label="Total Value Locked" value="$24.5M" change="+12%" icon={<DollarSign />} />
                <KpiCard label="Active Vaults" value="3,120" change="+8.4%" icon={<Users />} />
                <KpiCard label="Total Executions" value="842K" change="+24%" icon={<Activity />} />
                <KpiCard label="Protocol Revenue" value="$125K" change="+5.1%" icon={<TrendingUp />} />
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                {/* MAIN CHART (TVL) */}
                <div className="lg:col-span-2">
                    <GlassCard className="h-[400px] p-6 flex flex-col">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neural-500" /> TVL Growth (USD)
                        </h3>
                        <div className="flex-grow w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DATA}>
                                    <defs>
                                        <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#050505", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Area type="monotone" dataKey="tvl" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTvl)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>

                {/* SECONDARY CHART (Ranking) */}
                <div className="lg:col-span-1">
                    <GlassCard className="h-[400px] p-6 overflow-hidden">
                        <h3 className="text-white font-bold mb-6">Top Strategies (7d)</h3>
                        <div className="space-y-4">
                            <RankRow rank={1} name="Cetus Arb v2" apy="24%" volume="$1.2M" />
                            <RankRow rank={2} name="DeepBook MM" apy="18%" volume="$840k" />
                            <RankRow rank={3} name="Scallop Loop" apy="12%" volume="$500k" />
                            <RankRow rank={4} name="Navi Flash" apy="9%" volume="$320k" />
                            <RankRow rank={5} name="Mole Leverage" apy="8.5%" volume="$150k" />
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ label, value, change, icon }: { label: string, value: string, change: string, icon: any }) {
    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{label}</span>
                <span className="text-neural-500 opacity-80">{icon}</span>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-3xl font-mono font-bold text-white">{value}</span>
                <span className="text-sm text-green-400 mb-1">{change}</span>
            </div>
        </GlassCard>
    );
}

function RankRow({ rank, name, apy, volume }: { rank: number, name: string, apy: string, volume: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${rank === 1 ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-white/50"}`}>
                    {rank}
                </span>
                <span className="text-sm font-medium text-white group-hover:text-neural-500 transition-colors">{name}</span>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-white">{apy} APY</div>
                <div className="text-[10px] text-white/40">Vol: {volume}</div>
            </div>
        </div>
    );
}
