# 📜 TALOS PROTOCOL: TECHNICAL WHITE PAPER
**Version 2.0.0 (Production Ready)**
**Authors:** Vaiosx (Lead Architect), M0nsxx (Protocol Engineer), Maux (Frontend Eng.) 
**Date:** January 2026

---

## 1. Abstract
Talos is a **Non-Custodial Execution Runtime** for AgentFi on the Sui Network. It solves the critical trilemma of autonomous agents: **Security vs. Autonomy vs. Efficiency**.

User assets are held in a **Smart Vault** protected by Sui's Object Capabilities (`OwnerCap`). The Agent operates via a restricted `AgentCap`, allowing it to execute high-frequency strategies (Arbitrage, Market Making) without ever taking custody of funds. 

The system leverages **Programmable Transaction Blocks (PTB)** for atomic execution and integrates **7K Aggregator** and **Pyth Network** for best-in-class routing and data fidelity.

---

## 2. Architecture Overview

### 2.1 Layered Stack
The system is composed of four distinct layers:

1.  **Smart Contracts (Sui Move 2024)**:
    *   **Vault Object**: Holds assets (SUI, USDC, CETUS).
    *   **Hot Potato (FlashReceipt)**: Enforces atomic "Borrow -> Execution -> Repay" logic.
    *   **Oracle Integration**: Consumes `Pyth` price feeds for trigger validation.
    *   **SubscriptionRegistry**: Manages SaaS access via NFT-gated tiers.

2.  **Execution Engine (Node.js/TypeScript)**:
    *   **Discovery**: Indexing via Sui RPC to find active `AgentCap` objects.
    *   **Liquidity Routing**: Real-time integration with **7K Aggregator API** to find optimal swap paths.
    *   **Tx Construction**: Batched PTBs that combine Flash Loan + Swap + Repayment.

3.  **Data & Oracle Layer**:
    *   **Pyth Network**: Provides low-latency price updates on-chain (Sui Testnet/Mainnet).
    *   **Wormhole**: Guardian network for cross-chain validity.

4.  **Frontend Interface (Next.js 16)**:
    *   **Dashboard**: Real-time Vault management and "System Status" monitoring.
    *   **Tech Stripes**: Visual confirmation of active partners (7K/Pyth).
    *   **Wallet**: Native integration via `@mysten/dapp-kit`.

---

## 3. Smart Contract Mechanics

### 3.1 The "Hot Potato" Flash Loan Pattern
To ensure funds are **never** stolen by the agent, Talos enforces an atomic borrow/repay cycle within a single transaction block.

```move
// 1. Borrow (Agent Action)
public fun borrow_flash<T>(...): (Coin<T>, FlashReceipt) {
    // ... Checks AgentCap & Subscription ...
    // ... Emits FlashReceipt (Hot Potato) ...
}

// 2. Execution (In PTB)
// -> Checks Pyth Price
// -> Swaps via 7K Aggregator (DeepBook/Cetus/Kriya)

// 3. Repay (Mandatory)
public fun repay_flash<T>(..., receipt: FlashReceipt) {
    // ... Must return >= amount borrowed ...
    // ... Destroys FlashReceipt ...
}
```
If the Agent attempts to transfer funds out without calling `repay_flash`, execution aborts.

### 3.2 Oracle Guardrails
Before borrowing, the contract can optionally verify market conditions:
*   Imports `pyth::pyth` and `pyth::price_info`.
*   Address mapping in `Move.toml` ensures connection to Official Testnet Oracles (`0x00b5...`).

---

## 4. Off-Chain Worker Logic

### 4.1 Real Aggregation (7K)
The Worker (`worker.ts`) now implements full aggregation logic:
1.  **Quote Fetch**: Calls `https://api.7k.ag/quote` with `amountIn` and `slippage`.
2.  **Route Parsing**: Extracts the optimal route (e.g., SUI -> CETUS -> USDC -> SUI).
3.  **PTB Injection**: Injects the swap instructions directly into the Flash Loan sandwich.

### 4.2 "Proof of Life" (Testnet Mode)
Since Testnet liquidity is fragmented, the Worker defaults to a simulation mode if liquidity is zero:
*   **Strategy**: `SplitCoins` -> `MergeCoins`.
*   **Purpose**: Generates "Move Events" and proves permission validity ($0 cost).
*   **Visibility**: Activity is verifiable on Sui Explorer.

---

## 5. Frontend & Data Layer

### 5.1 Dashboard & Analytics
*   **System Status**: A persistent footer component (`SystemStatus.tsx`) displays connectivity to 7K Exec, Pyth Oracles, and Sui Network.
*   **Real-Time Ticker**: SUI price action via CoinGecko.
*   **Vault Analytics**: Dynamic calculating of TVL and PnL based on on-chain objects.

### 5.2 Responsive Experience
*   **Mobile First**: All components (`TechIntegrationStrip`, `Navbar`, `VaultView`) are optimized for touch devices.
*   **Performance**: Server-side rendering (SSR) for initial load, client-side hydration for wallet interaction.

---

## 6. Security & Compliance

### 6.1 Audit Status
Status: **PENDING verification**.
*   The UI explicitly displays "Audit Status: PENDING" to manage user expectations.
*   Contracts follow standard Move capability patterns (`OwnerCap` vs `AgentCap`).

### 6.2 Regulatory Compliance (Mexico/Global)
*   **Non-Custodial**: Talos never touches user funds ("Captación" risk = 0).
*   **Tech Provider**: The protocol is a tool, not a fund manager ("Asesoría" risk = 0).
*   **Geo-Blocking**: Ready-to-deploy IP filtering for sanctioned regions.

---

## 7. Roadmap to Mainnet

1.  **Phase 1 (Complete)**: Testnet Deployment, 7K/Pyth Integration (Code Level), UI Polish.
2.  **Phase 2 (Current)**: Community Testing, "Proof of Life" tx generation.
3.  **Phase 3**: Smart Contract Audit (OtterSec/Zellic).
4.  **Phase 4**: Mainnet Launch (Switch `Move.toml` & Envs).

---

<div align="center">
    <i>Talos Systems © 2026. Built on Sui.</i>
</div>
