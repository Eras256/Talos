-- TALOS DATABASE SCHEMA (PostgreSQL)

-- 1. USERS
-- Links on-chain address to profile settings
CREATE TABLE users (
    address VARCHAR(66) PRIMARY KEY, -- Sui Address (0x...)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. SUBSCRIPTIONS
-- SaaS Management
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(66) REFERENCES users(address) ON DELETE CASCADE,
    tier VARCHAR(20) CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE')) DEFAULT 'FREE',
    credits_balance INT DEFAULT 0, -- Compute credits for agents
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VAULTS
-- Indexes on-chain 'Vault' objects for fast querying
CREATE TABLE vaults (
    vault_id VARCHAR(66) PRIMARY KEY, -- On-Chain Object ID
    owner_address VARCHAR(66) REFERENCES users(address),
    name VARCHAR(100),
    current_balance BIGINT DEFAULT 0, -- Stored in MIST
    is_frozen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENTS / HISTORY
-- Time-series data for the portfolio graph
CREATE TABLE strategy_executions (
    id SERIAL PRIMARY KEY,
    vault_id VARCHAR(66) REFERENCES vaults(vault_id),
    tx_digest VARCHAR(66) NOT NULL,
    input_amount BIGINT NOT NULL,
    output_amount BIGINT NOT NULL,
    profit_loss BIGINT GENERATED ALWAYS AS (output_amount - input_amount) STORED,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON vaults FOR SELECT USING (true);
