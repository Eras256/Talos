import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Client (Read Only Key is fine for public data, but using Env for safety)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for backend route to ensure access
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    try {
        // 1. Fetch User's Vaults
        const { data: vaults, error: vaultsError } = await supabase
            .from("vaults")
            .select("*")
            .eq("owner_address", address);

        if (vaultsError) throw vaultsError;

        if (!vaults || vaults.length === 0) {
            return NextResponse.json({ portfolio: [], total_balance: 0 });
        }

        // 2. Fetch Performance History for all user vaults
        // (Simplification -> In prod, optimize query)
        const vaultIds = vaults.map(v => v.vault_id);
        const { data: history, error: historyError } = await supabase
            .from("strategy_executions")
            .select("*")
            .in("vault_id", vaultIds)
            .order("timestamp", { ascending: true });

        if (historyError) throw historyError;

        // 3. Construct Graph Data (Cumulative Aggregation)
        // We want a time series: { time: '...', value: number }
        // This requires merging the history of potentially multiple vaults.

        // Simple logic: Total Assets Over Time
        // Start with current balance, iterate backwards? 
        // Or start with 0 (if valid) + deposits. 
        // Since we don't index deposits in this simple script, we only see PnL.
        // For the UI demo: We will return the raw PnL history.

        return NextResponse.json({
            vaults,
            history,
            last_synced: new Date().toISOString()
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
