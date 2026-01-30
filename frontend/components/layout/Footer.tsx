"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Twitter, Disc, Code, ExternalLink, X } from "lucide-react";
import LegalModal from "@/components/legal/LegalModal";

export default function Footer() {
    const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'risk' | null>(null);

    return (
        <>
            <footer className="relative z-10 border-t border-white/5 bg-obsidian/80 backdrop-blur-md mt-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">

                    {/* TOP SECTION: Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-12">

                        {/* BRAND COLUMN (Span 4) */}
                        <div className="col-span-2 md:col-span-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-neural-900 to-neural-500 flex items-center justify-center border border-white/20">
                                    <span className="text-white font-bold font-mono">T</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">TALOS.SYS</span>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                                The non-custodial execution runtime for AI Agents.
                                Deploy strictly defined algorithmic strategies on Sui Move 2024.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <SocialLink href="https://x.com/vaiosx" icon={<X className="w-5 h-5" />} />
                            </div>
                        </div>

                        {/* LINKS COLUMN 1: Product */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-wider">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="/marketplace">Marketplace</FooterLink>
                                <FooterLink href="/studio">Agent Studio</FooterLink>
                                <FooterLink href="/vaults">My Vaults</FooterLink>
                                <FooterLink href="/analytics">Network Stats</FooterLink>
                            </ul>
                        </div>

                        {/* LINKS COLUMN 2: Resources */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <FooterLink href="#">Documentation</FooterLink>
                                <FooterLink href="#">GitHub Repo</FooterLink>
                                <FooterLink href="#">Sui Move Standard</FooterLink>
                                <FooterLink href="#">Audit Reports</FooterLink>
                            </ul>
                        </div>

                        {/* LINKS COLUMN 3: Legal */}
                        <div className="col-span-2 md:col-span-4 space-y-4">
                            <h4 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-wider">Compliance</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <button onClick={() => setLegalType('terms')} className="text-white/60 hover:text-white transition-colors text-left">
                                        Terms of Service
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setLegalType('privacy')} className="text-white/60 hover:text-white transition-colors text-left">
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setLegalType('risk')} className="text-white/60 hover:text-white transition-colors text-left">
                                        Risk Disclosure
                                    </button>
                                </li>
                            </ul>
                            <div className="p-4 rounded bg-white/5 border border-white/5 text-xs text-white/40 mt-4">
                                <p className="mb-2 font-semibold text-white/60">🇲🇽 Regulatory Notice</p>
                                Talos is a technology provider, not a financial institution. We do not provide financial advice (Asesoría) or hold user funds (Captación) under the Mexican Fintech Law.
                            </div>
                        </div>

                    </div>

                    {/* BOTTOM SECTION: Copyright & Badges */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-white/30 text-center md:text-left">
                            © 2026 Talos Systems. Made by Vaiosx. All rights reserved.
                        </p>


                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mt-4 md:mt-0">

                            {/* NETWORK STATUS */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-sui-blue/20 bg-sui-blue/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sui-blue animate-pulse" />
                                <span className="text-[10px] font-mono font-bold text-sui-blue uppercase tracking-wider">Net: Sui Testnet</span>
                            </div>

                            {/* ORACLE STATUS */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-purple-500/20 bg-purple-500/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">Oracle: Pyth</span>
                            </div>

                            {/* EXECUTION STATUS */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-green-500/20 bg-green-500/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-wider">Exec: 7K Aggregator</span>
                            </div>

                            {/* AUDIT STATUS */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-orange-500/20 bg-orange-500/5">
                                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider">Audit: Pending</span>
                            </div>

                        </div>

                    </div>

                </div>
            </footer>

            <LegalModal
                isOpen={!!legalType}
                type={legalType}
                onClose={() => setLegalType(null)}
            />
        </>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                {children}
                <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/30" />
            </Link>
        </li>
    );
}
