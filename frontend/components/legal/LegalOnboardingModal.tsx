"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { checkClientGeoBlock } from "@/lib/legal/geoblock";

interface LegalModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onReject: () => void;
}

export default function LegalOnboardingModal({ isOpen, onAccept, onReject }: LegalModalProps) {
    const [isBlocked, setIsBlocked] = useState(false);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            checkClientGeoBlock().then((blocked) => {
                if (blocked) setIsBlocked(true);
            });
        }
    }, [isOpen]);

    const handleScroll = () => {
        const el = contentRef.current;
        if (!el) return;
        // Tolerance of 10px
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 10) {
            setHasScrolledToBottom(true);
        }
    };

    if (!isOpen) return null;

    if (isBlocked) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6">
                <div className="max-w-md w-full bg-red-950/30 border border-red-500/50 p-8 rounded-2xl text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-white/60 mb-6">
                        We are unable to offer services in your jurisdiction (USA/Sanctioned Region) due to local financial regulations.
                    </p>
                    <button onClick={onReject} className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30">
                        Exit Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-obsidian w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-neural-500" />
                        <h2 className="text-xl font-bold text-white">Talos Systems - Service Agreement</h2>
                    </div>

                    {/* Scrollable Terms */}
                    <div
                        ref={contentRef}
                        onScroll={handleScroll}
                        className="p-6 overflow-y-auto space-y-4 text-sm text-white/70 leading-relaxed custom-scrollbar"
                    >
                        <p className="font-bold text-white">IMPORTANT NOTICE: NON-CUSTODIAL SOFTWARE</p>
                        <p>
                            Talos Systems ("The Protocol") is strictly a software interface. By accessing this platform, you acknowledge:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>No Custody:</strong> We never hold your funds. You retain 100% control via your Private Keys (OwnerCap).
                            </li>
                            <li>
                                <strong>No Financial Advice:</strong> The "AI Agents" and "Skills" displayed are pre-configured algorithms. Historical performance is not indicative of future results.
                            </li>
                            <li>
                                <strong>Execution Risk:</strong> You are responsible for any losses incurred by the automated strategies you deploy. Moving funds to a smart contract involves inherent risks of bugs or exploits.
                            </li>
                            <li>
                                <strong>Mexican Law (Ley Fintech):</strong> This platform does not solicit funds (Captación) nor provide personalized investment advice (Asesoría Financiera). It is a technological tool for self-custody automation.
                            </li>
                        </ul>
                        <p className="pt-4 font-mono text-xs text-white/40">
                            [Scroll to bottom to accept]
                        </p>
                        <div className="h-12"></div> {/* Spacer to ensure scroll triggers */}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
                        <button
                            onClick={onReject}
                            className="text-white/40 hover:text-white px-4"
                        >
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={!hasScrolledToBottom}
                            className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${hasScrolledToBottom
                                ? "bg-neural-500 hover:bg-neural-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                : "bg-white/10 text-white/30 cursor-not-allowed"
                                }`}
                        >
                            {hasScrolledToBottom ? <CheckCircle className="w-4 h-4" /> : null}
                            {hasScrolledToBottom ? "I Accept & Proceed" : "Read to Accept"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
