# 📜 TALOS PROTOCOL
**Non-Custodial Agent Runtime on Sui**

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=talos-sui)](https://talos-sui.vercel.app)
[![Sui](https://img.shields.io/badge/Sui-Move_2024-blue)](https://sui.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Live Demo:** [https://talos-sui.vercel.app](https://talos-sui.vercel.app)

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

## 3. Quick Start

### Prerequisites
*   Node.js v20+
*   Sui CLI (v1.45+)
*   Pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/Eras256/Talos.git
cd Talos

# Install dependencies (Frontend & Backend)
pnpm install
```

### Running Locally

```bash
# Frontend
cd frontend
pnpm dev

# Backend Worker (Needs .env)
cd backend
pnpm start
```

---

## 4. Team
*   **Vaiosx**: Lead Architect / Core
*   **M0nsxx**: UX/UI
*   **Maux**: Growth

---

<div align="center">
    <i>Talos Systems © 2026. Built on Sui.</i>
</div>
