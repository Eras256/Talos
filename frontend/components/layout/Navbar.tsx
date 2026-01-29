"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { Menu, X, Activity, Box, Terminal as TerminalIcon, DollarSign, Book } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-white/10 font-mono">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group mr-8">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-sui-blue/20 blur-md group-hover:bg-sui-blue/40 transition-colors rounded-full" />
                            <TerminalIcon className="relative w-5 h-5 text-sui-blue" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-white leading-none">TALOS</span>
                            <span className="text-[10px] text-sui-blue tracking-[0.2em] font-bold">PROTOCOL</span>
                        </div>
                    </Link>

                    {/* Desktop Links (Center) */}
                    <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                        <NavLink href="/dashboard" icon={Activity}>Monitor</NavLink>
                        <NavLink href="/marketplace" icon={Box}>Market</NavLink>
                        <NavLink href="/studio" icon={TerminalIcon}>Studio</NavLink>
                        <NavLink href="/analytics" icon={DollarSign}>Data</NavLink>
                        <NavLink href="/docs" icon={Book}>Docs</NavLink>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ConnectButton className="!bg-sui-blue !hover:bg-sui-ocean !text-white !font-bold !font-mono !rounded-md" />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-white/70 hover:text-white"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-terminal-black border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-2 font-mono">
                            <MobileNavLink href="/dashboard">System Monitor</MobileNavLink>
                            <MobileNavLink href="/marketplace">Algorithm Market</MobileNavLink>
                            <MobileNavLink href="/studio">Code Studio</MobileNavLink>
                            <MobileNavLink href="/analytics">Network Data</MobileNavLink>
                            <div className="pt-4 border-t border-white/10 mt-4">
                                <ConnectButton className="w-full justify-center !font-mono" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
        >
            <Icon className="w-3 h-3" />
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block text-sm font-bold text-white/70 hover:text-sui-blue hover:pl-2 transition-all py-3 border-b border-white/5 uppercase tracking-widest"
        >
            {">"} {children}
        </Link>
    );
}
