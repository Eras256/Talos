
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const REGISTRY_ID = "0x3841cfc1c719eb397e92ce85b61cb3ebb57638e9cb1dbb53b4db3e9490639c4f";

async function main() {
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    console.log(`Fetching Registry: ${REGISTRY_ID}`);

    try {
        const obj = await client.getObject({
            id: REGISTRY_ID,
            options: { showContent: true }
        });

        if (obj.error) {
            console.error("Error fetching object:", obj.error);
            return;
        }

        console.log("Registry Type:", obj.data?.content?.dataType);

        if (obj.data?.content?.dataType === 'moveObject') {
            console.log("Fields:", JSON.stringify(obj.data.content.fields, null, 2));
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

main();
