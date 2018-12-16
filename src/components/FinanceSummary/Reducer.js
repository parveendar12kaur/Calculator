import { _ } from 'third_party'
import {
    CASH,
    LEASE,
    LOAN,
    FINANCE_DETAILS_CHANGE,
    FINANCE_DETAILS_EXPAND,
    INTERNAL_CALC
}
    from 'dictionary'

import { i18n }
    from 'utils'
import {
    formatMonthlyPrice,
    formatCurrency,
    formatPercent
}
    from '@web/tesla-lang'

export const initialState = {
    expanded: false,
    [CASH]: {
        items: []
    },
    [LEASE]: {
        items: []
    },
    [LOAN]: {
        items: []
    }
}

// Finance Summary Reducer
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case FINANCE_DETAILS_EXPAND:
            return Object.assign({}, state, {
                expanded: !state.expanded
            })
        case FINANCE_DETAILS_CHANGE:
            return Object.assign({}, state, {
                current: {
                    items: getLineItems(state, action),
                    ..._.omit(action, ['fees'])
                },
                [action.financeType]: {
                    items: getLineItems(state, action),
                    ..._.omit(action, ['fees'])
                }
            })
        default:
            return state
    }
}

// this could be abstracted into json...
function getLineItems(state, action) {
    // depositAmount = 2500,
    // postalCode,
    const {
        totalDownPayment,
        firstMonthsPayment,
        dueAtDeliveryTotal,
        estMonthlyPayment,
        amountFinanced,
        interestRate,
        vehiclePrice,
        fees = [],
        term,
        context
    } = action

    const contextItems = {
        [INTERNAL_CALC]: [{
            type: 'total',
            minimal: true,
            label: i18n('labels.monthly_payment_total'),
            value: formatMonthlyPrice(estMonthlyPayment)
        }, {
            type: 'total',
            minimal: true,
            label: i18n('labels.due_at_delivery'),
            value: formatCurrency(dueAtDeliveryTotal)
        }, {
            type: 'line',
            label: i18n('labels.term'),
            value: term
        }, {
            type: 'line',
            label: i18n('labels.apr'),
            value: formatPercent(interestRate)
        }, {
            type: 'line',
            label: i18n('labels.amount_financed'),
            value: formatCurrency(amountFinanced)
        }, {
            type: 'total',
            label: i18n('labels.monthly_payment_total'),
            value: formatMonthlyPrice(estMonthlyPayment)
        }, {
            type: 'title',
            label: i18n('labels.due_at_delivery')
        },
        {
            type: 'line',
            label: i18n('labels.vehicle_price'),
            value: formatCurrency(vehiclePrice)
        },
        {
            type: 'total',
            label: i18n('labels.due_at_delivery_total'),
            value: formatCurrency(dueAtDeliveryTotal)
        }],
        default: [{
            type: 'line',
            id: 'vehiclePrice',
            financeType: [CASH, LOAN],
            label: i18n('labels.vehicle_price'),
            value: vehiclePrice,
            formattedValue: formatCurrency(vehiclePrice)
        }, {
            type: 'line',
            id: 'totalDownPayment',
            financeType: [LEASE],
            label: i18n('labels.total_down_payment'),
            value: formatCurrency(totalDownPayment)
        }, {
            type: 'line',
            id: 'firstMonthsPayment',
            financeType: LEASE,
            label: i18n('labels.first_months_payment'),
            value: formatCurrency(firstMonthsPayment)
        },
        {
            type: 'line',
            id: 'amountFinanced',
            financeType: LOAN,
            label: i18n('labels.amount_financed'),
            value: amountFinanced,
            formattedValue: formatCurrency(amountFinanced)
        }

        ]
    }

    return (() => (contextItems[context] || contextItems.default).concat(fees))()
}


export default Reducer
