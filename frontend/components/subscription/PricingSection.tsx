"use client";

import { useEffect } from "react";
import PricingCard from "./PricingCard";
import { useSubscription, TierId } from "@/hooks/useSubscription";
import { motion } from "framer-motion";

export default function PricingSection() {
    const { checkStatus, subscribe, status, submitting } = useSubscription();

    // Load status on mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const tiers = [
        {
            id: 1,
            name: "Hobbyist",
            price: 5,
            features: [
                "Deploy Basic Vaults",
                "Access to Community Strategies",
                "Standard Execution Speed",
                "Email Support"
            ]
        },
        {
            id: 2,
            name: "Pro Agent",
            price: 25,
            isRecommended: true,
            features: [
                "Deploy Advanced Vaults",
                "High-Frequency Arbitrage Bots",
                "DeepDeep Market Maker Access",
                "Real-time Analytics Dashboard",
                "Priority Discord Support"
            ]
        },
        {
            id: 3,
            name: "Whale Alpha",
            price: 150,
            features: [
                "Unlimited Vault Deployments",
                "Private Institutional Strategies",
                "MEV Protection (Flashbots)",
                "Dedicated Account Manager",
                "Early Access to Beta Models"
            ]
        }
    ];

    return (
        <section id="pricing" className="relative py-12 md:py-24 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[800px] h-[150vw] md:h-[800px] bg-purple-900/20 rounded-full blur-[100px] md:blur-[120px] -z-10 animate-pulse-slow" />

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6"
                    >
                        Monetize Intelligence
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/50 max-w-2xl mx-auto"
                    >
                        Upgrade your runtime to unlock advanced AI capabilities. <br />
                        Process payments directly on-chain with SUI.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <PricingCard
                            key={tier.id}
                            tierId={tier.id as TierId}
                            name={tier.name}
                            price={tier.price}
                            features={tier.features}
                            isRecommended={tier.isRecommended}
                            currentTier={status.tier}
                            onSubscribe={subscribe}
                            isProcessing={submitting}
                        />
                    ))}
                </div>

                {status.isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="font-mono text-sm">
                                Active Plan: Tier {status.tier} — {status.daysRemaining} days remaining
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
