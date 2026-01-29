<div align="center">

# ⚡ T A L O S · S Y S

### The Non-Custodial Execution Runtime for AgentFi
*Autonomous Capital Allocation on Sui Network*

[Launch App](https://talos.sys) · [Documentation](https://docs.talos.sys) · [View Contract](https://suiexplorer.com)

---

![Talos Banner](https://img.shields.io/badge/Status-Mainnet_Ready-00D26A?style=for-the-badge&logo=statuspage)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Network](https://img.shields.io/badge/Network-SUI_Move-4DA2FF?style=for-the-badge&logo=sui)

</div>

## 🌌 The Narrative
In a fragmented liquidity landscape, **Agility is Power**. 
Traditional trading bots require you to surrender your private keys—a fatal flaw in the "Trustless" economy.

**Talos** breaks this paradigm. We introduce the **Smart Vault Architecture**, separating *Ownership* from *Execution*.
You hold the keys. The Agent holds the trigger. 

Welcome to the future of **AgentFi**, where AI strategies run 24/7 on high-performance rails without ever touching your seed phrase.

---

## 🛠️ Technology Stack

Talos is built with a hyper-modern stack designed for **10ms latency** and **Atomic Safety**.

### **Core Protocol (The Brain)**
| Tech | Role | Description |
| :--- | :--- | :--- |
| <img src="https://cryptologos.cc/logos/sui-sui-logo.png" width="20"/> **Sui Move** | **Smart Contracts** | `Hot Potato` pattern for atomic flash loans. Object-centric security. |
| <img src="https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png" width="20"/> **Node.js** | **Agent Worker** | Off-chain strategy runtime. Executes logic via `AgentCap`. |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/1200px-C_Programming_Language.svg.png" width="20"/> **Cetus SDK** | **Aggregator** | Deep liquidity routing and flash swap execution. |

### **Frontend Experience (The Glass)**
| Tech | Role | Description |
| :--- | :--- | :--- |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/2560px-Nextjs-logo.svg.png" width="20"/> **Next.js 15** | **Framework** | Server-side rendering, App Router, and dynamic optimization. |
| <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="20"/> **TailwindCSS** | **Styling** | "Neural Glass" design system with obsidian/neon aesthetics. |
| <img src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" width="20"/> **Framer Motion** | **Animation** | Fluid transitions, page exits, and heavy micro-interactions. |
| <img src="https://radix-ui.com/social/logo.png" width="20"/> **Radix UI** | **Accessibility** | Accessible modal primitives, tooltips, and dialogs. |
| <img src="https://recharts.org/static/logo.png" width="20"/> **Recharts** | **Analytics** | Real-time TVL and APY visualization. |

---

## ⚡ Key Features

### 🛡️ **Zero-Trust Security**
We utilize **Object Capabilities**. The user creates a `Vault` and receives the `OwnerCap`. The worker receives an `AgentCap` which *only* permits the `borrow_flash` method. The agent can **never** withdraw funds.

### ⚛️ **Atomic Flash Execution**
Using Sui's **Programmable Transaction Blocks (PTBs)**, we bundle:
1.  **Borrow** (Flash Loan)
2.  **Execute** (Arbitrage/Swap)
3.  **Repay** (Return Loan + Profit)
...into a single transaction. If the strategy produces a loss, the entire transaction reverts. **Zero Risk.**

### 🧠 **Agent Marketplace**
Browse, verify, and deploy pre-trained strategies like *Delta Neutral Yield* or *Cetus Arbitrage* directly from the dashboard.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   Sui CLI installed
*   Sui Wallet (Extension)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Eras256/Talos.git
cd Talos

# 2. Install dependencies
pnpm install

# 3. Configure Environment
cp .env.example .env
nano .env # Set SUI_NODE_URL and PRIVATE_KEYS
```

### Deployment

```bash
# Deploy Move Contracts & Sync Addresses
./publish.sh
```

### Run Local

```bash
# Start Frontend
cd frontend && pnpm dev

# Start Agent Worker
cd backend && npx ts-node src/worker.ts
```

---

## 👥 The Team

<div align="center">

| **Vaiosx** | **M0nsxx** |
| :---: | :---: |
| <img src="https://avatars.githubusercontent.com/u/0?v=4" width="100" style="border-radius:50%"/> | <img src="https://avatars.githubusercontent.com/u/0?v=4" width="100" style="border-radius:50%"/> |
| *Lead Architect* | *Protocol Engineer* |
| 💻 Full Stack | ⛓️ Smart Contracts |

</div>

---

<div align="center">
  <small>© 2026 Talos Systems. All Rights Reserved.</small>
</div>
