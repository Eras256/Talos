import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['var(--font-geist-mono)', 'monospace'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            colors: {
                // Deep Space / Terminal Backgrounds
                obsidian: "#050608",
                "terminal-black": "#0A0F14",
                "terminal-glass": "rgba(10, 15, 20, 0.7)",

                // Sui Brand Colors (Approximation for High-Tech Vibe)
                sui: {
                    blue: "#4DA2FF",     // Bright Sui Blue
                    ocean: "#3D82CC",    // Deeper Blue
                    dark: "#1C293A",     // Navy
                    mist: "#E6F3FF",     // Light text
                },

                // Neural/Agent Accents
                neural: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    500: "#6366f1", // Indigo core
                    glow: "#818cf8",
                },

                // Status
                success: "#00D26A",
                warning: "#F2C94C",
                error: "#FF4D4D",
            },
            backgroundImage: {
                "grid-pattern": "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                "scanline": "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
                "sui-gradient": "linear-gradient(135deg, #4DA2FF 0%, #6366f1 100%)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 6s ease-in-out infinite",
                "typing": "typing 3.5s steps(40, end), blink-caret .75s step-end infinite",
                "scan": "scan 8s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                typing: {
                    "from": { width: "0" },
                    "to": { width: "100%" }
                },
                "blink-caret": {
                    "from, to": { borderColor: "transparent" },
                    "50%": { borderColor: "#4DA2FF" }
                },
                scan: {
                    "0%": { backgroundPosition: "0 0" },
                    "100%": { backgroundPosition: "0 100%" },
                }
            },
        },
    },
    plugins: [],
};
export default config;
