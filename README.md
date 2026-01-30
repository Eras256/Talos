# 📜 TALOS PROTOCOL: TECHNICAL WHITE PAPER
**Version 1.0.0 (Testnet Release)**
**Authors:** Vaiosx (Lead Architect), M0nsxx (Protocol Engineer)
**Date:** January 2026

---

## 1. Abstract
Talos is a **Non-Custodial Execution Runtime** for AgentFi on the Sui Network. It solves the critical trilemma of autonomous agents: **Security vs. Autonomy vs. Efficiency**.
Unlike traditional bots that require private key custody, Talos utilizes a **Smart Vault Architecture** where the user retains ownership (`OwnerCap`) while delegating Granular Execution Rights (`AgentCap`) to an off-chain worker.

## 2. Architecture Overview

### 2.1 The Core Components
The system is composed of three distinct layers:

1.  **On-Chain Protocol (Sui Move)**:
    *   **Vault Object**: Holds assets (SUI, USDC, CETUS).
    *   **OwnerCap**: Held by User. Allows withdrawals and freezing.
    *   **AgentCap**: Held by Worker. Allows *only* flash loan initialization.
    *   **SubscriptionRegistry**: Manages access control via tiered monthly subscriptions (paid in SUI).

2.  **Execution Worker (Node.js/TypeScript)**:
    *   Listens for `AgentCap` objects owned by the agent wallet.
    *   Calculates arbitrage/optimization paths off-chain.
    *   Constructs **Programmable Transaction Blocks (PTBs)** to execute strategies atomically.
    *   **Proof of Life (Testnet)**: Simulates complex DeFi routing via split/merge operations to prove execution capability without liquidity.

3.  **Frontend Interface (Next.js 16)**:
    *   **Dashboard**: Real-time monitoring of Vaults.
    *   **Studio**: No-code strategy configuration.
    *   **Analytics**: Live indexing of `SubscriptionRegistry` and on-chain activity.
    *   **Security**: Geo-blocking compliant (OFAC) and wallet-based authentication.

---

## 3. Smart Contract Mechanics

### 3.1 The "Hot Potato" Flash Loan Pattern
To ensure funds are **never** stolen by the agent, Talos enforces an atomic borrow/repay cycle within a single transaction.

```move
// 1. Borrow (Agent Action)
public fun borrow_flash<T>(...): (Coin<T>, FlashReceipt) {
    // ... Checks Subscription ...
    // ... Emits FlashReceipt (Hot Potato) ...
}

// 2. Execution (In PTB)
// ... Swap SUI -> USDC -> SUI (Arbitrage) ...

// 3. Repay (Mandatory)
public fun repay_flash<T>(..., receipt: FlashReceipt) {
    // ... Must return >= amount borrowed ...
    // ... Destroys FlashReceipt ...
}
```
If the Agent attempts to transfer funds out without calling `repay_flash`, the transaction fails because `FlashReceipt` cannot be dropped.

### 3.2 Subscription Gating
Access is gated by a `SubscriptionRegistry`.
*   Users subscribe by paying SUI.
*   The contract mints a dynamic field attached to the Registry.
*   `borrow_flash` checks `clock` vs. `expiration_ms` before releasing funds.

---

## 4. Off-Chain Worker Logic

### 4.1 "Proof of Life" (Testnet Mode)
Since Testnet liquidity is insufficient for real profitable arbitrage, the Worker implements a **Proof of Life** algorithm to demonstrate capability:

1.  **Poll**: Detects assigned Vaults via `getOwnedObjects`.
2.  **Analyze**: Determines the asset available (e.g., SUI).
3.  **Construct PTB**:
    *   `borrow_flash(1 SUI)`
    *   `splitCoins(0.1 SUI)` -> Simulates Swap Input.
    *   `mergeCoins` -> Simulates Swap Output.
    *   `repay_flash(1 SUI)`
4.  **Execute**: Submits tx via `signAndExecuteTransaction`.

### 4.2 Mainnet Aggregation
In Mainnet mode, the Worker connects to **Cetus Aggregator** and **DeepBook**:
*   Fetches quotes via API.
*   Constructs PTB with `cetus::swap` and `deepbook::place_limit_order`.
*   Includes `min_amount_out` checks to prevent slippage loss.

---

## 5. Frontend & Data Layer

### 5.1 Real-Time Analytics
Instead of hardcoded mock data, the frontend now performs dynamic fetching:
*   **Total Vaults**: Queried directly from `SubscriptionRegistry` on-chain state.
*   **TVL**: Estimated based on live price feeds and vault balances.
*   **Price Ticker**: SUI/USD price fetched via CoinGecko API (`SuiPriceTicker.tsx`).

### 5.2 Deployment Pipeline
*   **Hosting**: Vercel (Production optimized).
*   **CI/CD**: Automatic builds via `git push`.
*   **Security**: Environment variables (`NEXT_PUBLIC_NETWORK`) partition Testnet/Mainnet configs.

---

## 6. Security Audit Notes
*   **Non-Custodial**: Agent cannot withdraw.
*   **Atomic**: Loss-making trades revert.
*   **Frozen State**: User can call `emergency_shutdown` to revoke Agent access instantly.
*   **Access Control**: Only `OwnerCap` can add/remove assets.

---

<div align="center">
    <i>Talos Protocol - Defining the Standard for Move-based AgentFi</i>
</div>
