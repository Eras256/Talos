import { Album, Radio } from "lucide-react";

export default function SystemStatus() {
    return (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-sm w-fit mx-auto mt-8">

            {/* 7K Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    Exec: <span className="text-white/80 font-bold">7K AGG</span>
                </span>
            </div>

            {/* Pyth Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    Oracle: <span className="text-white/80 font-bold">PYTH</span>
                </span>
            </div>

            {/* Network Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                <Radio className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    Net: <span className="text-blue-400 font-bold">SUI TESTNET</span>
                </span>
            </div>

        </div>
    );
}
