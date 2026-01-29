import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
    title: "TALOS | AgentFi Runtime",
    description: "Non-custodial execution runtime for AI Agents on Sui.",
};

import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-obsidian min-h-screen text-white/90 selection:bg-neural-500/30 font-sans">
                <Providers>
                    <ToastProvider>
                        <AppShell>
                            {children}
                        </AppShell>
                    </ToastProvider>
                </Providers>
            </body>
        </html>
    );
}
