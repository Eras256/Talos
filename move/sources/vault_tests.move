
#[test_only]
module talos::vault_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::coin::{Self};
    use talos::vault::{Self, Vault, OwnerCap, AgentCap};

    // --- Helpers ---
    
    fun setup_test(addr: address): Scenario {
        let mut scenario = test_scenario::begin(addr);
        {
            vault::create_vault(std::string::utf8(b"Alpha Agent Vault"), test_scenario::ctx(&mut scenario));
        };
        scenario
    }

    // --- Tests ---

    #[test]
    fun test_happy_path() {
        let user = @0xA;
        let mut scenario = setup_test(user);

        // 1. User Deposits
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let payment = coin::mint_for_testing(1000, test_scenario::ctx(&mut scenario));
            vault::deposit(&mut vault_val, payment);
            test_scenario::return_shared(vault_val);
        };

        // 2. Agent Executes
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let agent_cap = test_scenario::take_from_sender<AgentCap>(&scenario);
            
            // 100 in, expect 100 min. (Simulates 105)
            vault::execute_strategy(&mut vault_val, &agent_cap, 100, 100, test_scenario::ctx(&mut scenario));

            test_scenario::return_shared(vault_val);
            test_scenario::return_to_sender(&scenario, agent_cap);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = talos::vault::ESlippageExceeded)]
    fun test_slippage_fail() {
        let user = @0xB;
        let mut scenario = setup_test(user);
        
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let agent_cap = test_scenario::take_from_sender<AgentCap>(&scenario);
            let payment = coin::mint_for_testing(1000, test_scenario::ctx(&mut scenario));
            vault::deposit(&mut vault_val, payment);

            // Expect 200 (impossible since mock yields 105)
            vault::execute_strategy(&mut vault_val, &agent_cap, 100, 200, test_scenario::ctx(&mut scenario));

            test_scenario::return_shared(vault_val);
            test_scenario::return_to_sender(&scenario, agent_cap);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = talos::vault::EAccessRevoked)]
    fun test_emergency_shutdown() {
        let user = @0xC;
        let mut scenario = setup_test(user);
        
        // 1. User calls Shutdown
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let owner_cap = test_scenario::take_from_sender<OwnerCap>(&scenario);
            
            vault::emergency_shutdown(&mut vault_val, &owner_cap);
            
            test_scenario::return_shared(vault_val);
            test_scenario::return_to_sender(&scenario, owner_cap);
        };

        // 2. Agent tries to execute -> Fail
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let agent_cap = test_scenario::take_from_sender<AgentCap>(&scenario);
            let payment = coin::mint_for_testing(1000, test_scenario::ctx(&mut scenario));
            vault::deposit(&mut vault_val, payment);

            vault::execute_strategy(&mut vault_val, &agent_cap, 100, 0, test_scenario::ctx(&mut scenario));

            test_scenario::return_shared(vault_val);
            test_scenario::return_to_sender(&scenario, agent_cap);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_theft_attempt_proven_by_invariant() {
        let user = @0xD;
        let mut scenario = setup_test(user);
        
        // 1. Setup: Deposit 1000
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let payment = coin::mint_for_testing(1000, test_scenario::ctx(&mut scenario));
            vault::deposit(&mut vault_val, payment);
            assert!(vault::balance(&vault_val) == 1000, 0);
            test_scenario::return_shared(vault_val);
        };

        // 2. Agent Executes Strategy
        // If theft occurred, balance would decrease.
        // We assert logic keeps funds in vault.
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut vault_val = test_scenario::take_shared<Vault>(&scenario);
            let agent_cap = test_scenario::take_from_sender<AgentCap>(&scenario);
            
            let pre_balance = vault::balance(&vault_val);
            
            vault::execute_strategy(&mut vault_val, &agent_cap, 100, 0, test_scenario::ctx(&mut scenario));
            
            let post_balance = vault::balance(&vault_val);
            
            // PROOF: Balance MUST be >= pre_balance (assuming no loss strategy mock)
            // In our mock, we put the input back exactly, so it should be equal.
            assert!(post_balance >= pre_balance, 1);
            
            // This proves the agent didn't "send to self" or burn without permission.
            
            test_scenario::return_shared(vault_val);
            test_scenario::return_to_sender(&scenario, agent_cap);
        };
        test_scenario::end(scenario);
    }
}
