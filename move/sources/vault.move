module talos::vault {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::bag::{Self, Bag};
    use std::type_name::{Self, TypeName};
    use sui::event;
    use sui::clock::{Clock};
    use talos::subscription::{Self, SubscriptionRegistry};
    // use pyth::pyth::{Self, PriceIdentifier, PriceInfoObject}; // Uncomment when mainnet dependency is resolved
    // use pyth::price_info;
    // use pyth::i64;

    // --- Oracle Config ---
    // const MAX_AGE_SECS: u64 = 60; 

    // --- Error Codes ---
    const ENotOwner: u64 = 0;
    const ENotAuthorized: u64 = 1;
    const EInsufficientFunds: u64 = 2;
    const ERepaymentInvalid: u64 = 3;
    const EVaultFrozen: u64 = 4;
    const EInvalidAsset: u64 = 5;
    const ENoSubscription: u64 = 6;

    // --- Capabilities ---

    public struct OwnerCap has key, store {
        id: UID,
        vault_id: ID
    }

    public struct AgentCap has key, store {
        id: UID,
        vault_id: ID,
    }

    // --- Core Object ---

    public struct Vault has key {
        id: UID,
        owner: address,       // Informational
        assets: Bag,          // Dynamic Asset Store
        is_frozen: bool,
        name: std::string::String, 
    }

    // --- Hot Potato ---

    /// The "receipt" that proves a flash loan is active.
    /// Because it has no `drop`, `store`, or `key`, it MUST be passed to `repay_flash` 
    /// to be destroyed within the transaction block.
    public struct FlashReceipt {
        vault_id: ID,
        amount: u64,
        asset_type: TypeName
    }

    // --- Events ---
    public struct VaultCreated has copy, drop {
        vault_id: ID,
        owner: address
    }

    public struct FlashBorrowEvent has copy, drop {
        vault_id: ID,
        amount: u64,
        asset: std::ascii::String
    }

    public struct FlashRepayEvent has copy, drop {
        vault_id: ID,
        amount: u64,
        profit: u64
    }

    // --- Init ---

    public fun create_vault(name: std::string::String, ctx: &mut TxContext): (OwnerCap, AgentCap) {
        let vault_uid = object::new(ctx);
        let vault_id = object::uid_to_inner(&vault_uid);
        let sender = tx_context::sender(ctx);

        let vault = Vault {
            id: vault_uid,
            owner: sender,
            assets: bag::new(ctx),
            is_frozen: false,
            name
        };

        transfer::share_object(vault);

        event::emit(VaultCreated {
            vault_id,
            owner: sender
        });

        let owner_cap = OwnerCap {
            id: object::new(ctx),
            vault_id
        };

        let agent_cap = AgentCap {
            id: object::new(ctx),
            vault_id,
        };

        (owner_cap, agent_cap)
    }

    // --- User Actions ---

    /// Deposit ANY coin type into the Vault's Bag
    public fun deposit<T>(vault: &mut Vault, payment: Coin<T>) {
        let type_n = type_name::get<T>();
        
        if (!bag::contains(&vault.assets, type_n)) {
            bag::add(&mut vault.assets, type_n, coin::into_balance(payment));
        } else {
            let bal = bag::borrow_mut(&mut vault.assets, type_n);
            balance::join(bal, coin::into_balance(payment));
        }
    }

    /// Withdraw ANY coin type using OwnerCap
    public fun withdraw<T>(
        vault: &mut Vault,
        cap: &OwnerCap,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<T> {
        assert!(object::uid_to_inner(&vault.id) == cap.vault_id, ENotOwner);
        let type_n = type_name::get<T>();
        
        assert!(bag::contains(&vault.assets, type_n), EInvalidAsset);
        let bal = bag::borrow_mut<TypeName, Balance<T>>(&mut vault.assets, type_n);
        assert!(balance::value(bal) >= amount, EInsufficientFunds);
        
        let split = balance::split(bal, amount);
        
        coin::from_balance(split, ctx)
    }

    // --- Agent Actions (Hot Potato Flash Pattern) ---

    /// Step 1: Agent borrows funds to execute logic in PTB.
    /// Requires a valid Subscription (at least Tier 1).
    public fun borrow_flash<T>(
        vault: &mut Vault,
        cap: &AgentCap,
        amount: u64,
        registry: &SubscriptionRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ): (Coin<T>, FlashReceipt) {
        // Permissions
        assert!(object::uid_to_inner(&vault.id) == cap.vault_id, ENotAuthorized);
        assert!(!vault.is_frozen, EVaultFrozen);

        // Subscription Check (Tier 1 Minimum)
        assert!(
            subscription::check_access(registry, clock, vault.owner, 1), 
            ENoSubscription
        );

        let type_n = type_name::get<T>();

        // Check Funds
        assert!(bag::contains(&vault.assets, type_n), EInsufficientFunds);
        let bal = bag::borrow_mut<TypeName, Balance<T>>(&mut vault.assets, type_n);
        assert!(balance::value(bal) >= amount, EInsufficientFunds);

        // Take Funds
        let funds = coin::take(bal, amount, ctx);

        // Emit Receipt (Hot Potato)
        let receipt = FlashReceipt {
            vault_id: object::uid_to_inner(&vault.id),
            amount,
            asset_type: type_n
        };

        event::emit(FlashBorrowEvent {
            vault_id: object::uid_to_inner(&vault.id),
            amount,
            asset: type_name::into_string(type_n)
        });

        (funds, receipt)
    }

    /// Step 2: Agent MUST repay at least the borrowed amount.
    public fun repay_flash<T>(
        vault: &mut Vault,
        repayment: Coin<T>,
        receipt: FlashReceipt
    ) {
        let FlashReceipt { vault_id, amount, asset_type } = receipt;

        // Validation
        assert!(object::uid_to_inner(&vault.id) == vault_id, ERepaymentInvalid);
        assert!(asset_type == type_name::get<T>(), ERepaymentInvalid);
        
        let returned_val = coin::value(&repayment);
        assert!(returned_val >= amount, ERepaymentInvalid);

        // Calculate Profit (for Event Log)
        let profit = returned_val - amount;

        // Re-store Funds
        if (!bag::contains(&vault.assets, asset_type)) {
            bag::add(&mut vault.assets, asset_type, coin::into_balance(repayment));
        } else {
            let bal = bag::borrow_mut<TypeName, Balance<T>>(&mut vault.assets, asset_type);
            balance::join(bal, coin::into_balance(repayment));
        };

        event::emit(FlashRepayEvent {
            vault_id,
            amount: returned_val,
            profit
        });
    }

    // --- Safety ---

    public fun emergency_shutdown(
        vault: &mut Vault, 
        cap: &OwnerCap,
    ) {
        assert!(object::uid_to_inner(&vault.id) == cap.vault_id, ENotOwner);
        vault.is_frozen = true;
    }
    
    public fun resume_vault(
        vault: &mut Vault, 
        cap: &OwnerCap,
    ) {
        assert!(object::uid_to_inner(&vault.id) == cap.vault_id, ENotOwner);
        vault.is_frozen = false;
    }
}
