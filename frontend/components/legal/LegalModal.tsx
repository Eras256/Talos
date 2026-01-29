"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { LEGAL_CONTENT } from "@/data/LegalContent";

type LegalType = 'terms' | 'privacy' | 'risk' | null;

interface LegalModalProps {
    isOpen: boolean;
    type: LegalType;
    onClose: () => void;
}

export default function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
    if (!isOpen || !type) return null;

    const content = LEGAL_CONTENT[type];
    const Icon = type === 'terms' ? FileText : type === 'privacy' ? Shield : AlertTriangle;
    const color = type === 'risk' ? 'text-yellow-400' : 'text-cyan-400';
    const border = type === 'risk' ? 'border-yellow-500/30' : 'border-cyan-500/30';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`bg-[#0A0A0A] border ${border} w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 ${color}`} />
                            <div>
                                <h2 className="text-xl font-bold text-white">{content.title}</h2>
                                <p className="text-xs text-white/40">Last Updated: {content.lastUpdated}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                        {content.sections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-white font-semibold mb-2">{section.heading}</h3>
                                <p className="text-white/60 text-sm leading-relaxed text-justify">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 bg-white/2 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
