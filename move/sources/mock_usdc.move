module talos::mock_usdc {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url;

    public struct MOCK_USDC has drop {}

    fun init(witness: MOCK_USDC, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<MOCK_USDC>(
            witness,
            6,
            b"mUSDC",
            b"Mock USDC",
            b"Mock USDC for Talos Testnet",
            option::some(url::new_unsafe_from_bytes(b"https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/usdc.png/public")),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_share_object(treasury_cap); // Public Treasury for Faucet!
    }

    public fun mint(
        treasury_cap: &mut TreasuryCap<MOCK_USDC>, 
        amount: u64, 
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}
