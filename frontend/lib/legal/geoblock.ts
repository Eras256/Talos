// Headers import removed to support client -side usage


const BLOCKED_COUNTRIES = ["US", "CN", "RU", "KP", "IR"];

/**
 * Checks if the request originates from a blocked jurisdiction.
 * Note: In a real Next.js middleware, checking 'x-vercel-ip-country' or similar header is standard.
 */
export async function isBlockedIP(): Promise<boolean> {
    // In client-side logic or simple API routes without edge middleware, we rely on headers if passed,
    // or an external IP API. 

    // For this Architecture Demo, we will simulate the check function.
    // In production: Use Middleware (middleware.ts) checking `req.geo.country`.

    // MOCK:
    return false;
}

// Client-side helper (if needed) to check via an API
export async function checkClientGeoBlock(): Promise<boolean> {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (BLOCKED_COUNTRIES.includes(data.country_code)) {
            return true;
        }
    } catch (e) {
        console.warn("Geo-check failed, defaulting to allow (risk).");
    }
    return false;
}
