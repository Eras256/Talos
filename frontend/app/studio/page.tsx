"use client";

import { useState } from "react";
import { Code, Save, Play, Box } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function StudioPage() {
    const [code, setCode] = useState(
        `// TALOS SKILL MANIFEST v1.0
// Define your agent strategy below.

skill "Liquid Staking Optimizer" {
    version: "1.0.0";
    permissions: [
        "scallop::deposit",
        "scallop::withdraw"
    ];

    on_tick(ctx) {
         let rates = oracle.get_staking_rates();
         if (rates.scallop > rates.cetus) {
             // Logic here
             log("Rebalancing to Scallop...");
         }
    }
}`
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12 min-h-screen lg:h-[calc(100vh-80px)] flex flex-col">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3">
                        <Box className="w-8 h-8 text-neural-500" /> Agent Studio
                    </h1>
                    <p className="text-white/50 text-sm mt-1">
                        Author and publish new execution strategies using the <code className="bg-white/10 px-1 rounded">skills.sh</code> standard.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Save Draft
                    </button>
                    <button className="px-5 py-2 bg-neural-500 hover:bg-neural-600 text-white font-bold rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Play className="w-4 h-4" /> Compile & Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">

                {/* EDITOR COLUMN */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <GlassCard className="flex-grow flex flex-col p-1 bg-black/40">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex gap-2 text-xs text-white/50 font-mono">
                            <span>manifest.skill</span>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-grow bg-transparent p-6 text-sm font-mono text-neural-100 focus:outline-none resize-none leading-relaxed selection:bg-neural-500/30"
                            spellCheck="false"
                        />
                    </GlassCard>
                </div>

                {/* SIDEBAR CONFIG */}
                <div className="space-y-6 overflow-y-auto">

                    <GlassCard className="p-6">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Metadata</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 block mb-2">Strategy Name</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-neural-500 focus:outline-none" placeholder="e.g. Delta Neutral Yield" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 block mb-2">Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-neural-500 focus:outline-none h-24 resize-none" placeholder="Explain the logic..." />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Required Permissions</h3>
                        <div className="space-y-2">
                            <PermissionToggle label="Cetus Trade" active />
                            <PermissionToggle label="DeepBook Limit" active />
                            <PermissionToggle label="Kriya Swap" active={false} />
                            <PermissionToggle label="Scallop Lend" active={false} />
                        </div>
                    </GlassCard>

                    <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-200/80 text-xs leading-relaxed">
                        <strong>Audit Warning:</strong> Custom strategies must pass automated simulation before being listed on the public marketplace.
                    </div>

                </div>

            </div>

        </div>
    );
}

function PermissionToggle({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={`p-3 rounded border flex justify-between items-center ${active ? "bg-neural-500/10 border-neural-500/40" : "bg-white/5 border-white/5 opacity-50"}`}>
            <span className="text-sm text-white font-mono">{label}</span>
            <div className={`w-2 h-2 rounded-full ${active ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-white/20"}`} />
        </div>
    );
}
