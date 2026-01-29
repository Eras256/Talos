"use client";

import { motion } from "framer-motion";
import { Loader2, Check, Zap } from "lucide-react";
import { TierId } from "@/hooks/useSubscription";

interface PricingCardProps {
    tierId: TierId;
    name: string;
    price: number;
    features: string[];
    isRecommended?: boolean;
    currentTier: number;
    onSubscribe: (tier: TierId, price: number) => void;
    isProcessing: boolean;
}

export default function PricingCard({
    tierId,
    name,
    price,
    features,
    isRecommended,
    currentTier,
    onSubscribe,
    isProcessing
}: PricingCardProps) {

    const isCurrent = currentTier === tierId;
    const canUpgrade = currentTier < tierId;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
                relative flex flex-col p-8 rounded-2xl border backdrop-blur-2xl transition-all duration-300
                ${isRecommended
                    ? "bg-white/10 border-cyan-500/50 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]"
                }
            `}
        >
            {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-cyan-500/40">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-xl font-bold ${isRecommended ? "text-cyan-400" : "text-white"}`}>
                    {name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-white tracking-tighter">{price}</span>
                    <span className="text-sm text-white/50 font-mono">SUI / mo</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                        <Check className={`w-5 h-5 shrink-0 ${isRecommended ? "text-cyan-400" : "text-white/40"}`} />
                        <span className="leading-tight">{feat}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onSubscribe(tierId, price)}
                disabled={isCurrent || isProcessing}
                className={`
                    w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group
                    ${isCurrent
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : isRecommended
                            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                            : "bg-white text-black hover:bg-white/90"
                    }
                    ${isProcessing ? "opacity-70 cursor-wait" : ""}
                `}
            >
                {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isCurrent ? (
                    <>
                        <Check className="w-5 h-5" /> Current Plan
                    </>
                ) : (
                    <>
                        <Zap className={`w-5 h-5 ${isRecommended ? "fill-black" : "fill-black"}`} />
                        {canUpgrade ? "Upgrade Access" : "Switch Plan"}
                    </>
                )}
            </button>
        </motion.div>
    );
}
