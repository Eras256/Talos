"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceData {
    price: number;
    change24h: number;
}

export default function SuiPriceTicker() {
    const [data, setData] = useState<PriceData | null>(null);

    useEffect(() => {
        async function fetchPrice() {
            try {
                // Fetch from Coingecko (Free API, minimal rate limits)
                const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&include_24hr_change=true");
                const json = await res.json();

                if (json.sui) {
                    setData({
                        price: json.sui.usd,
                        change24h: json.sui.usd_24h_change
                    });
                }
            } catch (e) {
                console.warn("Pricing fetch failed", e);
            }
        }

        fetchPrice();
        // Refresh every 60s
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/5 text-xs font-mono text-white/30 animate-pulse">
            SUI: $...
        </div>
    );

    const isPositive = data.change24h >= 0;

    return (
        <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-white/5 rounded border border-white/5 text-xs font-mono">
            <span className="text-white/60 font-bold">SUI</span>
            <span className="text-white">${data.price.toFixed(3)}</span>
            <span className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(data.change24h).toFixed(2)}%
            </span>
        </div>
    );
}
