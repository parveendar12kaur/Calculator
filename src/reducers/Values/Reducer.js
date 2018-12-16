import { _ } from 'third_party'
import {
    PRICE_CHANGE,
    FINANCE_TYPE_CHANGE,
    TERMS_CHANGE,
    CALCULATING_PRICE,
    INITIAL_DATA_LOADED,
    INCENTIVE_DATA_LOADED,
    FUEL_SAVINGS_CHANGE,
    MONTHLY_GAS_SAVINGS_CHANGE,
    FUEL_SAVINGS,
    LOCATION_CHANGE,
    LOCATION
} from 'dictionary'

const Reducer = (state = {}, action) => {
    const financeType = action.financeType || state.financeType
    switch (action.type) {
        case INITIAL_DATA_LOADED:
            return Object.assign({}, state, applyDefaultValues(state, action.defaultValues))

        case TERMS_CHANGE:
            return Object.assign({}, state, {
                [financeType]: Object.assign({}, state[financeType], { [action.term]: action.value })
            })

        case FINANCE_TYPE_CHANGE:
            return Object.assign({}, state, {
                financeType,
                [financeType]: Object.assign({}, state[financeType], {
                    // persist downPayment across financeTypes
                    downPayment: state.current.downPayment
                }),
                current: Object.assign({}, state[financeType])
            })

        case CALCULATING_PRICE:
            return Object.assign({}, state, {
                subTotal: action.subTotal,
                // set cash price
                cash: Object.assign({}, state.cash, {
                    vehiclePrice: action.subTotal
                }),
                options: action.options
            })

        case PRICE_CHANGE:
            return Object.assign({}, state, {
                current: Object.assign({}, state[financeType], action.calculatedValues),
                [financeType]: Object.assign({}, state[financeType], action.calculatedValues)
            })

        case INCENTIVE_DATA_LOADED:
            return Object.assign({}, state, applyDefaultValues(state, action.defaultValues))

        case FUEL_SAVINGS_CHANGE:
            return Object.assign({}, state, {
                [FUEL_SAVINGS]: Object.assign({}, state[FUEL_SAVINGS], { [action.name]: action.value })
            })

        case LOCATION_CHANGE:
            return Object.assign({}, state, {
                [LOCATION]: Object.assign({}, state[LOCATION], _.omit(action, 'type'))
            })

        default:
            return state
    }
}

/**
 * Adds default values to available finance types if they are not already set by the time the terms service data loads
 * @param  {Object} state         [redux state]
 * @param  {Object} defaultValues [default values from terms service]
 * @return {Object}               [updated object with defaults]
 */
function applyDefaultValues(state, defaultValues) {
    return _.reduce(defaultValues, (r, financeTypeDefaults, financeType) => {
        r[financeType] = Object.assign({}, state[financeType], _.reduce(financeTypeDefaults, (r1, termValue, term) => {
            // only set the defaults here if they are not already set
            if (!_.has(state, `${financeType}.${term}`)) {
                r1[term] = financeTypeDefaults[term]
            }
            return r1
        }, {}))
        return r
    }, {})
}

export default Reducer
