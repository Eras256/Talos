"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Cpu, Activity, Play, CheckCircle, Smartphone, Lock, Terminal } from "lucide-react";
import TerminalWindow from "@/components/ui/TerminalWindow";
import GlassCard from "@/components/ui/GlassCard";
import TechIntegrationStrip from "@/components/landing/TechIntegrationStrip";

const CODE_PREVIEW = `// TALOS_PROTOCOL_V1 //
module talos::strategy {
    use sui::sui::SUI;
    use cetus::pool;

    public fun execute_flash_arb(
        vault: &mut Vault, 
        clock: &Clock
    ) {
        // 1. Detect Price Delta
        let delta = oracle::get_spread();
        
        // 2. Atomic Flash Loan
        if (delta > 0.5%) {
            let loan = vault.borrow_flash(1000 * SUI);
            
            // 3. Execute Loop
            let profit = pool::swap(loan);
            
            vault.repay_flash(loan);
        }
    }
}`;

export default function Home() {
    return (
        <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden font-mono text-sui-mist">

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* LEFT COLUMN: TEXT */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 mb-6 border border-sui-blue/30 bg-sui-blue/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-sui-blue">
                        <span className="w-2 h-2 bg-sui-blue rounded-full animate-pulse" />
                        System Online :: Testnet v1.0
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <img src="/talos-logo.png" alt="Talos Protocol" className="w-24 h-auto" />
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 leading-tight">
                        DEPLOY <span className="text-sui-blue animate-pulse">AUTONOMOUS</span> <br />
                        CAPITAL AGENTS.
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed max-w-xl">
                        Talos is the non-custodial runtime for AgentFi.
                        Launch automated strategies using Sui's atomic Programmable Transaction Blocks (PTB).
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/marketplace"
                            className="px-8 py-4 bg-sui-blue hover:bg-sui-ocean text-white font-bold rounded flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] shadow-[0_0_20px_rgba(77,162,255,0.4)] uppercase tracking-wide text-sm"
                        >
                            <Play className="w-4 h-4 fill-current" /> Initialize
                        </Link>
                        <Link
                            href="/docs"
                            className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold rounded flex items-center justify-center gap-3 transition-all uppercase tracking-wide text-sm"
                        >
                            Documentation
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-xs text-white/30 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" /> Non-Custodial
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" /> 10ms Latency
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-sui-blue" /> AI Native
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: TERMINAL */}
                <div className="relative">
                    {/* Background Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sui-blue/20 blur-[120px] rounded-full pointer-events-none" />

                    <TerminalWindow title="agent_strategy.move" className="relative z-10 shadow-2xl shadow-sui-blue/10">
                        <div className="relative">
                            <pre className="text-[10px] sm:text-xs md:text-sm font-mono leading-relaxed">
                                <code className="language-rust text-sui-blue/80">
                                    {CODE_PREVIEW}
                                </code>
                            </pre>

                            {/* Overlay Activity Log */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="absolute bottom-4 right-4 bg-black/80 border border-green-500/30 p-4 rounded text-xs w-64 backdrop-blur-md"
                            >
                                <div className="text-green-500 font-bold mb-2 border-b border-green-500/20 pb-1 flex justify-between">
                                    <span>LIVE LOGS</span>
                                    <Activity className="w-3 h-3 animate-spin" />
                                </div>
                                <div className="space-y-1 text-green-400/80 font-mono text-[10px]">
                                    <p>{">"} Scanning pools... [OK]</p>
                                    <p>{">"} Delta detected: 1.2SUI</p>
                                    <p>{">"} Building PTB... [OK]</p>
                                    <p className="animate-pulse">{">"} Executing Flash Loan...</p>
                                </div>
                            </motion.div>
                        </div>
                    </TerminalWindow>
                </div>

            </div>

            {/* STRIP: TECH INTEGRATION */}
            <TechIntegrationStrip />

            {/* STRIP: STATS */}
            <div className="border-y border-white/5 bg-black/40 backdrop-blur mt-24">
                <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatBox label="Total Value Locked" value="$42.5M" />
                    <StatBox label="Active Agents" value="3,129" />
                    <StatBox label="Gas Saved" value="12M SUI" />
                    <StatBox label="Uptime" value="99.99%" />
                </div>
            </div>

            {/* SECTION: EXECUTION BENEFITS */}
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">
                            Why Run on <span className="text-sui-blue">Talos?</span>
                        </h2>
                        <ul className="space-y-6">
                            <BenefitRow
                                title="No Key Exposure"
                                desc="Your private keys never leave your device. We use Object Capabilities (OwnerCap) to delegate confined permissions."
                            />
                            <BenefitRow
                                title="Parallel Execution"
                                desc="Sui's object-centric model allows multiple agents to trade simultaneously without state contention."
                            />
                            <BenefitRow
                                title="Instant Finality"
                                desc="Sub-second latency ensures your arbitrage strategies land before the market corrects."
                            />
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard className="flex flex-col items-center justify-center p-8 text-center bg-sui-blue/5 border-sui-blue/20">
                            <Smartphone className="w-10 h-10 text-sui-blue mb-4" />
                            <h3 className="font-bold text-white mb-1">Mobile First</h3>
                            <p className="text-xs text-white/50">Full dashboard control from any device.</p>
                        </GlassCard>
                        <GlassCard className="flex flex-col items-center justify-center p-8 text-center bg-green-500/5 border-green-500/20">
                            <Lock className="w-10 h-10 text-green-500 mb-4" />
                            <h3 className="font-bold text-white mb-1">Audited</h3>
                            <p className="text-xs text-white/50">Contracts verified by OtterSec.</p>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* SECTION: SYSTEM ARCHITECTURE */}
            <div className="max-w-[1400px] mx-auto px-6 py-24 border-t border-white/5">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">System Architecture</h2>
                    <div className="h-1 w-20 bg-sui-blue" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TechCard
                        icon={<Shield className="w-8 h-8 text-sui-blue" />}
                        title="Permissioned Security"
                        desc="Funds reside in a Smart Object Vault. Agents only hold an AgentCap with restricted methods, preventing unauthorized withdrawals."
                    />
                    <TechCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Atomic PTBs"
                        desc="Leverage Sui's Programmable Transaction Blocks to bundle borrowing, swapping, and repaying into a single atomic failure unit."
                    />
                    <TechCard
                        icon={<Cpu className="w-8 h-8 text-green-400" />}
                        title="Off-Chain Logic"
                        desc="Complex strategy logic runs off-chain in your Agent Runtime, submitting lightweight execution proofs to the chain."
                    />
                </div>
            </div>

            {/* SECTION: DEPLOYMENT STEPS */}
            <div className="bg-black/40 py-24 border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center uppercase tracking-wide">Deployment Pipeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-sui-blue/0 via-sui-blue/50 to-sui-blue/0 z-0" />

                        <StepItem num="01" title="Subscribe" desc="Mint your access pass to the AgentFi runtime." />
                        <StepItem num="02" title="Select Strategy" desc="Browse verified algorithms in the marketplace." />
                        <StepItem num="03" title="Deploy Vault" desc="Launch a smart object vault with initial capital." />
                        <StepItem num="04" title="Auto-Pilot" desc="Agent begins 27/7 execution loop." />
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-sui-blue/5 pointer-events-none" />
                <h2 className="text-4xl font-bold text-white mb-6 relative z-10">READY TO SYNCHRONIZE?</h2>
                <Link
                    href="/marketplace"
                    className="inline-flex px-12 py-5 bg-white text-black font-bold text-lg rounded hover:scale-105 transition-transform relative z-10 items-center gap-3"
                >
                    LAUNCH CONSOLE <Terminal className="w-5 h-5" />
                </Link>
            </div>

        </div>
    );
}

function StatBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col border-l-2 border-sui-blue/20 pl-4 hover:border-sui-blue transition-colors group cursor-default">
            <span className="text-4xl font-bold text-white group-hover:text-sui-blue transition-colors tracking-tighter">{value}</span>
            <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
        </div>
    )
}

function TechCard({ icon, title, desc }: any) {
    return (
        <GlassCard className="p-8 hover:bg-white/5 transition-all group border-l-4 border-l-transparent hover:border-l-sui-blue">
            <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 origin-left duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sui-blue transition-colors">
                {title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
                {desc}
            </p>
        </GlassCard>
    )
}

function BenefitRow({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <CheckCircle className="w-6 h-6 text-sui-blue shrink-0 mt-1" />
            <div>
                <h4 className="text-lg font-bold text-white">{title}</h4>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm">{desc}</p>
            </div>
        </div>
    )
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="relative z-10 bg-terminal-black border border-white/10 p-6 rounded hover:border-sui-blue transition-colors text-center md:text-left">
            <div className="text-4xl font-bold text-white/10 mb-4 font-mono">{num}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-white/50">{desc}</p>
        </div>
    )
}
