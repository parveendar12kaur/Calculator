import {
    PREORDER_CALC,
    CASH,
    LEASE,
    LOAN,
    INTERNAL_CALC,
    DEFAULT_VIEW,
    FUEL_SAVINGS,
    TAX_INCENTIVES,
    INCENTIVES_SUMMARY
} from 'dictionary'

export default {
    currentView: DEFAULT_VIEW,
    [PREORDER_CALC]: {
        layouts: {
            calculator: {
                [CASH]: {
                    name: 'Cash',
                    components: []
                },
                [LOAN]: {
                    // hook into translations
                    name: 'Loan',
                    components: []
                },
                [LEASE]: {
                    name: 'Lease',
                    components: []
                }
            },
            incentive: {
                [FUEL_SAVINGS]: {
                    name: 'FuelSavings',
                    components: []
                },
                [TAX_INCENTIVES]: {
                    name: 'TaxIncentives',
                    components: []
                },
                [INCENTIVES_SUMMARY]:{
                    name: "IncentivesSummary",
                    components: []
                }
            }
        }
    },
    [INTERNAL_CALC]: {
        layouts: {
            calculator: {
                [CASH]: {
                    name: 'Cash',
                    components: []
                },
                [LOAN]: {
                    // hook into translations
                    name: 'Loan',
                    components: []
                },
                [LEASE]: {
                    name: 'Lease',
                    components: []
                }
            }
        },
        contextViews: {
            sidebar: false,
            mainHeader: false
        }
    }
}
