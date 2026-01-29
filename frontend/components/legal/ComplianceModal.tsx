"use client";

import { useState, useEffect } from "react";
import { Copy, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

export default function ComplianceModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const hasAccepted = localStorage.getItem("talos_terms_accepted_v1");
        if (!hasAccepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("talos_terms_accepted_v1", "true");
        setAccepted(true);
        setIsOpen(false);
    };

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                {/* Overlay with blur */}
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out" />

                {/* Modal Content */}
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-obsidian border border-white/10 shadow-2xl p-0 overflow-hidden outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">

                    {/* Header */}
                    <div className="bg-neural-900/30 p-6 border-b border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <Dialog.Title className="text-lg font-bold text-white">Legal & Risk Disclosure</Dialog.Title>
                            <Dialog.Description className="text-xs text-white/40 uppercase tracking-widest mt-1">Required by Mexican Fintech Law</Dialog.Description>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 space-y-4 text-sm text-white/70 leading-relaxed font-sans max-h-[60vh] overflow-y-auto">
                        <p className="font-semibold text-white">
                            By accessing TALOS ("The Software"), you expressly acknowledge:
                        </p>

                        <ul className="space-y-3">
                            <li className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Non-Custodial:</strong> We do not hold your private keys or assets. You retain full control via your OwnerCap.
                                </span>
                            </li>
                            <li className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Software Only:</strong> TALOS is a technological tool, not a bank or financial advisor. Use of "Agents" is at your own risk.
                                </span>
                            </li>
                            <li className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Risk Acceptance:</strong> You accept all risks associated with DeFi, including smart contract bugs and market volatility.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-neural-900/20 flex flex-col gap-3">
                        <button
                            onClick={handleAccept}
                            className="w-full py-4 bg-neural-500 hover:bg-neural-600 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-neural-500/20"
                        >
                            I Understand & Accept <CheckCircle2 className="w-5 h-5" />
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
