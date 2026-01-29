#!/bin/bash

# Load Environment Variables
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '#' | awk '/=/ {print $1}')
fi

# Ensure SUI_NODE_URL is set for Testnet
export SUI_NODE_URL="https://fullnode.testnet.sui.io:443"

# Check if sui binary is in local bin or system path
if [ -f "./bin/sui" ]; then
    SUI_BIN="./bin/sui"
else
    SUI_BIN="sui"
fi

echo "🚀 Deploying TALOS to Testnet (V3 Re-Deploy)..."
echo "Using Sui Binary: $SUI_BIN"

# Remove previous publish info to force new publish
rm -f move/Published.toml

# Build
echo "🔨 Building..."
$SUI_BIN move build --path move

# Publish and capture output to file
echo "📡 Publishing..."
$SUI_BIN client publish --gas-budget 500000000 --skip-dependency-verification move --json > publish_output.json

if [ $? -ne 0 ]; then
    echo "❌ Publish failed. Check publish_output.json"
    cat publish_output.json
    exit 1
fi

cat publish_output.json
echo "✅ Done. Output saved to publish_output.json"

# Sync Contracts to Configs
echo "🔄 Syncing contract addresses..."
# Assuming scripts/sync-contracts.ts exists in root or needs to be run from root
# We need ts-node. Check if it's installed globally or use npx/pnpm dlx
if [ -f "scripts/sync-contracts.ts" ]; then
    # Use pnpm exec to run local tsx
    pnpm exec tsx scripts/sync-contracts.ts
else
    echo "⚠️  scripts/sync-contracts.ts not found. Skipping sync."
fi
