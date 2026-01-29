
export const LEGAL_CONTENT = {
    terms: {
        title: "Terms of Service",
        lastUpdated: "January 15, 2026",
        sections: [
            {
                heading: "1. Acceptance of Terms",
                content: "By accessing and using the Talos Protocol ('the Protocol'), you agree to these Terms of Service. If you do not agree, you are prohibited from using this interface. The Protocol is a decentralized non-custodial software interface that interacts with the Sui Blockchain."
            },
            {
                heading: "2. Non-Custodial Nature",
                content: "Talos is a non-custodial software provider. We do not have custody, possession, or control of your digital assets at any time. You retain full control of your private keys and 'OwnerCap' objects. The 'AgentCap' delegated to our workers restricts permissions strictly to trading execution and does not allow withdrawal of funds."
            },
            {
                heading: "3. Mexican Regulatory Disclaimer (Ley Fintech)",
                content: "For users in Mexico: Talos Systems is NOT a Financial Technology Institution (Institución de Tecnología Financiera) regulated by the Comisión Nacional Bancaria y de Valores (CNBV) under the 'Ley para Regular las Instituciones de Tecnología Financiera' (Ley Fintech). We do not engage in 'Captación de Recursos' (fund raising from the public) nor do we provide guaranteed returns. All interactions are strictly peer-to-peer (P2P) on the blockchain."
            },
            {
                heading: "4. Prohibited Jurisdictions",
                content: "Access is prohibited from: Cuba, Iran, North Korea, Syria, Russia, Crimea, Donetsk, and Luhansk regions of Ukraine, and any other jurisdiction sanctioned by OFAC or where the use of DeFi is prohibited by local law."
            },
            {
                heading: "5. Limitation of Liability",
                content: "The Protocol is provided 'AS IS', without warranties of any kind. You assume all risks associated with smart contract execution, including bugs, exploits, or failure of the Sui Network. In no event shall Talos Systems be liable for any lost profits or data."
            }
        ]
    },
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "January 15, 2026",
        sections: [
            {
                heading: "1. Data Collection",
                content: "We minimize data collection. We do not collect names, addresses, or emails unless provided voluntarily for support. We process public blockchain data (Wallet Addresses, Transaction Histories) which is already publicly available on the Sui Network."
            },
            {
                heading: "2. Compliance with LFPDPPP (Mexico)",
                content: "In compliance with the 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares', we allow users to exercise their ARCO rights (Access, Rectification, Cancellation, Opposition) regarding off-chain data held on our servers. To exercise these rights, contact risk@talos.sys."
            },
            {
                heading: "3. Blockchain Immutability",
                content: "Please note that data written to the Sui Blockchain is immutable and permanent. We cannot legally 'erase' or 'modify' transaction records that have been finalized on-chain, even upon request, due to the technological nature of distributed ledgers."
            },
            {
                heading: "4. Cookies & Analytics",
                content: "We use privacy-preserving analytics (no cookies) to monitor usage patterns. We do not sell user data to third parties."
            }
        ]
    },
    risk: {
        title: "Risk Disclosure",
        lastUpdated: "January 15, 2026",
        sections: [
            {
                heading: "1. Smart Contract Risks",
                content: "While our Move modules (`talos::vault`, `talos::subscription`) have been audited, smart contracts always carry a risk of unknown vulnerabilities. You could lose all funds deposited in a Vault."
            },
            {
                heading: "2. Market Risk",
                content: "Crypto assets are highly volatile. Strategies like 'Delta Neutral' or 'Arbitrage' rely on market conditions that may change rapidly, potentially leading to liquidation or loss of principal."
            },
            {
                heading: "3. Regulatory Uncertainty",
                content: "The regulatory landscape for DeFi is evolving. New regulations in Mexico (CNBV), USA (SEC), or Europe (MiCA) could impact your ability to access the Protocol or the value of assets."
            },
            {
                heading: "4. Oracle Risk",
                content: "Our agents rely on on-chain data. Manipulation of price oracles (flash loan attacks) could trigger erroneous trades. We mitigate this with TWAP checks, but the risk cannot be eliminated."
            }
        ]
    }
};
