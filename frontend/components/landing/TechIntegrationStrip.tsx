import { Activity, Network, Radio, Zap } from "lucide-react";

export default function TechIntegrationStrip() {
    return (
        <div className="w-full border-y border-white/5 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm font-medium">

                    {/* Label Mobile Only */}
                    <span className="md:hidden text-white/30 text-xs uppercase tracking-widest">
                        Powered By
                    </span>

                    {/* 7K Aggregator */}
                    <div className="group flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors duration-300">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all">
                            <Zap className="w-5 h-5" />
                            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="uppercase tracking-wider text-[10px] text-white/30">Execution</span>
                            <span className="font-mono text-base tracking-tight">7K Aggregator</span>
                        </div>
                    </div>

                    {/* Separator (Desktop) */}
                    <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    {/* Pyth Network */}
                    <div className="group flex items-center gap-3 text-white/60 hover:text-purple-400 transition-colors duration-300">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all">
                            <Activity className="w-5 h-5" />
                            <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="uppercase tracking-wider text-[10px] text-white/30">Oracle Data</span>
                            <span className="font-mono text-base tracking-tight">Pyth Network</span>
                        </div>
                    </div>

                    {/* Separator (Desktop) */}
                    <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    {/* Sui Network */}
                    <div className="group flex items-center gap-3 text-white/60 hover:text-blue-400 transition-colors duration-300">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                            <Network className="w-5 h-5" />
                            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="uppercase tracking-wider text-[10px] text-white/30">Network</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-base tracking-tight">Sui Testnet</span>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
