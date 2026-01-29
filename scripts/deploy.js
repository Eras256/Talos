const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// CONFIG
const NETWORK = process.env.NETWORK || 'testnet';
const MOVE_DIR = path.join(__dirname, '../move');
const FRONTEND_CONFIG_PATH = path.join(__dirname, '../frontend/contracts.json');
const BACKEND_ENV_PATH = path.join(__dirname, '../backend/.env');

console.log(`\n🚀 STARTING TALOS PIPELINE [${NETWORK.toUpperCase()}]`);

// 1. BUILD & TEST
try {
    console.log('\n📦 Building Move Package...');
    execSync('sui move build', { cwd: MOVE_DIR, stdio: 'inherit' });

    console.log('\n🧪 Running Unit Tests...');
    execSync('sui move test', { cwd: MOVE_DIR, stdio: 'inherit' });
} catch (e) {
    console.error('❌ Build or Tests failed. Aborting deployment.');
    process.exit(1);
}

// 2. PUBLISH
try {
    console.log(`\n📡 Publishing to ${NETWORK}...`);
    // Assuming 'sui client' is configured for the correct env
    const jsonOutput = execSync(`sui client publish --gas-budget 200000000 --json`, {
        cwd: MOVE_DIR,
        encoding: 'utf-8'
    });

    const result = JSON.parse(jsonOutput);

    if (result.effects.status.status !== 'success') {
        throw new Error(`Transaction failed: ${result.effects.status.error}`);
    }

    // 3. PARSE OUTPUT
    const objectChanges = result.objectChanges;

    // Find Package ID (immutable reference)
    const packageId = objectChanges.find(
        obj => obj.type === 'published'
    )?.packageId;

    // Find UpgradeCap
    const upgradeCap = objectChanges.find(
        obj => obj.objectType && obj.objectType.includes('::package::UpgradeCap')
    )?.objectId;

    if (!packageId) throw new Error('Could not find Package ID in output');

    console.log(`\n✅ PUBLISH SUCCESS!`);
    console.log(`   Package ID: ${packageId}`);
    console.log(`   UpgradeCap: ${upgradeCap}`);

    // 4. UPDATE FRONTEND
    const contractData = {
        network: NETWORK,
        packageId: packageId,
        modules: {
            vault: `${packageId}::vault`,
        },
        upgradeCap: upgradeCap || "N/A",
        lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(FRONTEND_CONFIG_PATH, JSON.stringify(contractData, null, 2));
    console.log(`\n📄 Updated Frontend Config: ${FRONTEND_CONFIG_PATH}`);

    // 5. UPDATE BACKEND .ENV (Optional helper)
    if (fs.existsSync(BACKEND_ENV_PATH)) {
        let envContent = fs.readFileSync(BACKEND_ENV_PATH, 'utf-8');
        // Simple Replace or Append
        // This regex looks for PACKAGE_ID=... and replaces it, or appends if missing
        if (envContent.includes('PACKAGE_ID=')) {
            envContent = envContent.replace(/PACKAGE_ID=.*/g, `PACKAGE_ID="${packageId}"`);
        } else {
            envContent += `\nPACKAGE_ID="${packageId}"\n`;
        }
        fs.writeFileSync(BACKEND_ENV_PATH, envContent);
        console.log(`📄 Updated Backend .env: ${BACKEND_ENV_PATH}`);
    }

} catch (e) {
    console.error('❌ Deployment Failed:', e.message);
    // If output is verbose JSON, maybe log only snippet or parsing error
    process.exit(1);
}
