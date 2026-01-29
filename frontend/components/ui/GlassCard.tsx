"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={`glass-panel cursor-default ${className}`}
        >
            {/* Technical Corner Markers (Decals) */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 rounded-br-sm" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
