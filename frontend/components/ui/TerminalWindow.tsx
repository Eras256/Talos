"use client";

import { motion } from "framer-motion";
import { Minus, Square, X, Terminal } from "lucide-react";
import { ReactNode } from "react";

interface TerminalWindowProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export default function TerminalWindow({ children, title = "talos_agent_runtime ~", className = "" }: TerminalWindowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`glass-panel rounded-lg flex flex-col font-mono text-sm border-white/10 ${className}`}
        >
            {/* Terminal Header */}
            <div className="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-white/40">
                    <Terminal className="w-3 h-3 text-sui-blue" />
                    <span className="text-xs tracking-wider uppercase font-bold text-sui-blue/80">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500/50 flex items-center justify-center transition-colors">
                        <Minus className="w-2 h-2 text-yellow-500" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500/50 flex items-center justify-center transition-colors">
                        <Square className="w-1.5 h-1.5 text-green-500" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500/50 flex items-center justify-center transition-colors">
                        <X className="w-2 h-2 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-6 bg-terminal-black/40 flex-grow relative overflow-hidden backdrop-blur-sm">
                {/* Optional Grid Overlay inside terminal */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="relative z-10 text-sui-mist">
                    {children}
                </div>
            </div>

            {/* Footer with Status */}
            <div className="bg-black/40 px-4 py-1.5 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30 font-bold">
                <span>Mem: 4096MB OK</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                    Connected: Testnet
                </span>
            </div>
        </motion.div>
    );
}
