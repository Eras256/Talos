"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X, ExternalLink, Loader2 } from "lucide-react";

export type ToastType = 'success' | 'error' | 'info' | 'loading';

interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    txDigest?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<ToastMessage, 'id'>) => void;
    items: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ToastMessage[]>([]);

    const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newItem = { ...toast, id };

        setItems((prev) => [...prev, newItem]);

        if (toast.duration !== 0 && toast.type !== 'loading') {
            setTimeout(() => {
                setItems((prev) => prev.filter((item) => item.id !== id));
            }, toast.duration || 5000);
        }
    }, []);

    const removeToast = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, items }}>
            {children}

            <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {items.map((item) => (
                        <ToastItem key={item.id} item={item} onRemove={() => removeToast(item.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ item, onRemove }: { item: ToastMessage, onRemove: () => void }) {
    const isSuccess = item.type === 'success';
    const isError = item.type === 'error';
    const isLoading = item.type === 'loading';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="pointer-events-auto"
        >
            <div className={`
                flex items-start gap-4 p-4 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-sm
                ${isSuccess ? "bg-emerald-950/90 border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]" : ""}
                ${isError ? "bg-red-950/90 border-red-500/30 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]" : ""}
                ${isLoading ? "bg-neural-900/90 border-neural-500/30" : ""}
                ${item.type === 'info' ? "bg-blue-950/90 border-blue-500/30" : ""}
            `}>
                <div className={`
                    p-2 rounded-full shrink-0
                    ${isSuccess ? "bg-emerald-500/10 text-emerald-400" : ""}
                    ${isError ? "bg-red-500/10 text-red-400" : ""}
                    ${isLoading ? "bg-neural-500/10 text-neural-400" : ""}
                    ${item.type === 'info' ? "bg-blue-500/10 text-blue-400" : ""}
                `}>
                    {isSuccess && <CheckCircle2 className="w-6 h-6" />}
                    {isError && <XCircle className="w-6 h-6" />}
                    {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
                    {item.type === 'info' && <Info className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm ${isSuccess ? "text-emerald-100" : "text-white"}`}>
                        {item.title}
                    </h3>
                    {item.message && (
                        <p className="text-xs text-white/60 mt-1 leading-relaxed break-words">
                            {item.message}
                        </p>
                    )}

                    {item.txDigest && (
                        <a
                            href={`https://suiscan.xyz/testnet/tx/${item.txDigest}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
                        >
                            View on Explorer <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>

                <button
                    onClick={onRemove}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
