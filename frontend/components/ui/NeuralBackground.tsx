"use client";

import { useEffect, useRef } from "react";

export default function NeuralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Nodes
        const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
        const NODE_COUNT = 80;
        const CONNECTION_DISTANCE = 150;
        const MOUSE_DISTANCE = 200;

        // Mouse
        const mouse = { x: -1000, y: -1000 };

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            });
        }

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and Draw Nodes
            nodes.forEach((node, i) => {
                // Move
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Mouse Interaction
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_DISTANCE) {
                    node.x += (dx / dist) * 0.5; // Slight attraction
                    node.y += (dy / dist) * 0.5;
                }

                // Draw Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(99, 102, 241, 0.5)"; // Neural Indigo
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx2 = node.x - other.x;
                    const dy2 = node.y - other.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        // Opacity based on distance
                        const alpha = 1 - dist2 / CONNECTION_DISTANCE;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: "#050505" }} // Deep Obsidian fallback
        />
    );
}
