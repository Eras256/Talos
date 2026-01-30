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


                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-3 py-1 rounded border border-purple-500/20 bg-purple-500/5 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Audit Status:</span>
                                <span className="text-[10px] font-bold text-white shadow-purple-500 animate-pulse">PENDING</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-yellow-500/80">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                Mainnet Coming Soon
                            </div>
                            <a href="https://sui.io" target="_blank" className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                                <Code className="w-3 h-3" />
                                Built on Sui
                            </a>
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
