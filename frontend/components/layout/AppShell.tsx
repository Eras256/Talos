"use client";

import { useState, useEffect } from "react";
import NeuralBackground from "@/components/ui/NeuralBackground";
import LegalOnboardingModal from "@/components/legal/LegalOnboardingModal";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [showLegal, setShowLegal] = useState(false);
    const [hasAccepted, setHasAccepted] = useState(false);

    useEffect(() => {
        // Check local storage for previous acceptance
        const accepted = localStorage.getItem("talos_legal_accepted");
        if (!accepted) {
            setShowLegal(true);
        } else {
            setHasAccepted(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("talos_legal_accepted", "true");
        setHasAccepted(true);
        setShowLegal(false);
    };

    const handleReject = () => {
        window.location.href = "https://google.com"; // Redirect away
    };

    return (
        <>
            <NeuralBackground />
            <div className={`relative z-10 flex flex-col min-h-screen transition-filter duration-500 ${showLegal ? "blur-md" : ""}`}>
                <Navbar />
                <main className="flex-grow pt-20">
                    {children}
                </main>
                <Footer />
            </div>

            <LegalOnboardingModal
                isOpen={showLegal}
                onAccept={handleAccept}
                onReject={handleReject}
            />
        </>
    );
}
