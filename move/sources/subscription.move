module talos::subscription {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};

    // --- Constants ---
    const MSEC_PER_DAY: u64 = 86_400_000;
    const DURATION_MS: u64 = 30 * MSEC_PER_DAY; // 30 Days

    // Pricing (in MIST)
    const TIER_HOBBYIST_COST: u64 = 5_000_000_000;   // 5 SUI
    const TIER_PRO_COST: u64 = 25_000_000_000;       // 25 SUI
    const TIER_WHALE_COST: u64 = 150_000_000_000;    // 150 SUI

    // Tiers
    const TIER_HOBBYIST: u8 = 1;
    const TIER_PRO: u8 = 2;
    const TIER_WHALE: u8 = 3;

    // --- Errors ---
    const EInsufficientPayment: u64 = 0;
    const EInvalidTier: u64 = 2;

    // --- Core Objects ---

    /// Capability to manage the registry (withdraw funds).
    public struct AdminCap has key, store {
        id: UID
    }

    /// Global registry of subscriptions. Shared Object.
    public struct SubscriptionRegistry has key {
        id: UID,
        /// Accumulated revenue from subscriptions
        balance: Balance<SUI>,
        /// Maps user address -> UserSubscription details
        subscribers: Table<address, UserSubscription>
    }

    /// Details of a user's active subscription.
    public struct UserSubscription has store, drop {
        tier: u8,
        expiration_ms: u64
    }

    // --- Events ---
    public struct SubscriptionEvent has copy, drop {
        user: address,
        tier: u8,
        expiration: u64
    }

    // --- Init ---
    fun init(ctx: &mut TxContext) {
        // Create Registry
        transfer::share_object(SubscriptionRegistry {
            id: object::new(ctx),
            balance: balance::zero(),
            subscribers: table::new(ctx),
        });

        // Create AdminCap
        transfer::public_transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }

    // --- Public Functions ---

    /// Subscribe or renew a subscription.
    /// Handles upgrades (resets expiration) and renewals (extends expiration).
    public fun subscribe(
        registry: &mut SubscriptionRegistry, 
        clock: &Clock,
        tier: u8,
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        // 1. Validate Tier & Payment
        let cost = get_tier_cost(tier);
        assert!(coin::value(&payment) == cost, EInsufficientPayment);

        // 2. Absorb Payment
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut registry.balance, coin_balance);

        let sender = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        // 3. Update / Create Subscription
        if (table::contains(&registry.subscribers, sender)) {
            let sub = table::borrow_mut(&mut registry.subscribers, sender);
            
            if (sub.tier != tier) {
                // Tier Change (Upgrade/Downgrade): Reset timer to now + 30 days
                sub.tier = tier;
                sub.expiration_ms = current_time + DURATION_MS;
            } else {
                // Renewal (Same Tier): Extend time
                // If expired, start from now. If active, add to existing expiration.
                if (sub.expiration_ms > current_time) {
                    sub.expiration_ms = sub.expiration_ms + DURATION_MS;
                } else {
                    sub.expiration_ms = current_time + DURATION_MS;
                };
            };
            
            // Emit Event
            event::emit(SubscriptionEvent {
                user: sender,
                tier: sub.tier,
                expiration: sub.expiration_ms
            });

        } else {
            // New User
            let expiration_ms = current_time + DURATION_MS;
            table::add(&mut registry.subscribers, sender, UserSubscription {
                tier,
                expiration_ms
            });

            event::emit(SubscriptionEvent {
                user: sender,
                tier,
                expiration: expiration_ms
            });
        };
    }

    /// Check if a user has access to a required tier feature.
    /// Hierarchy: Whale (3) > Pro (2) > Hobbyist (1).
    /// Returns true if user exists, is not expired, and has tier >= required_tier.
    public fun check_access(
        registry: &SubscriptionRegistry, 
        clock: &Clock,
        user: address,
        required_tier: u8
    ): bool {
        // 1. Check existence
        if (!table::contains(&registry.subscribers, user)) {
            return false
        };

        let sub = table::borrow(&registry.subscribers, user);

        // 2. Check Expiration
        if (sub.expiration_ms <= clock::timestamp_ms(clock)) {
            return false
        };

        // 3. Hierarchy Check
        sub.tier >= required_tier
    }

    /// Admin: Withdraw accumulated revenue.
    public fun withdraw(
        registry: &mut SubscriptionRegistry,
        _: &AdminCap,
        ctx: &mut TxContext
    ): Coin<SUI> {
        let amount = balance::value(&registry.balance);
        let taken = balance::split(&mut registry.balance, amount);
        coin::from_balance(taken, ctx)
    }

    // --- Helpers ---

    fun get_tier_cost(tier: u8): u64 {
        if (tier == TIER_HOBBYIST) {
            TIER_HOBBYIST_COST
        } else if (tier == TIER_PRO) {
            TIER_PRO_COST
        } else if (tier == TIER_WHALE) {
            TIER_WHALE_COST
        } else {
            abort EInvalidTier
        } 
    }
}
