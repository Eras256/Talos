"use client";

import { useCurrentAccount, useDisconnectWallet, ConnectButton } from "@mysten/dapp-kit";
import { formatAddress } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Copy, Wallet, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletConnect() {
    const account = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const [copied, setCopied] = useState(false);

    // If not connected, show standard ConnectButton from dapp-kit
    if (!account) {
        return (
            <ConnectButton className="!bg-sui-blue !hover:bg-sui-ocean !text-white !font-bold !font-mono !rounded-md !px-4 !py-2 !h-10 !flex !items-center !justify-center" />
        );
    }

    const copyAddress = () => {
        navigator.clipboard.writeText(account.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-md transition-all group outline-none">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sui-blue to-purple-500 flex items-center justify-center">
                        <Wallet className="w-3 h-3 text-white" />
                    </div>

                    <span className="font-mono text-sm font-bold text-white/90">
                        {formatAddress(account.address)}
                    </span>

                    <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-[100] min-w-[200px] bg-obsidian border border-white/10 rounded-lg shadow-xl p-2 mt-2 animate-in fade-in zoom-in-95 duration-200"
                    align="end"
                    sideOffset={5}
                >
                    <div className="px-2 py-1.5 text-xs font-bold text-white/40 uppercase tracking-wider mb-1">
                        Connected As
                    </div>

                    <DropdownMenu.Item
                        onClick={copyAddress}
                        className="flex items-center justify-between px-2 py-2 rounded hover:bg-white/5 cursor-pointer text-sm text-white focus:outline-none focus:bg-white/10"
                    >
                        <span className="font-mono text-white/80">{formatAddress(account.address)}</span>
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-white/40" />
                        )}
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-white/10 my-2" />

                    <DropdownMenu.Item
                        onClick={() => disconnect()}
                        className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-500/10 cursor-pointer text-sm text-red-400 focus:outline-none focus:bg-red-500/10"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
