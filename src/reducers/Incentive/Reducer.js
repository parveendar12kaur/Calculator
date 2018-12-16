import {
    INCENTIVE_DATA_LOADED,
    INCENTIVES_CHANGE,
    MONTHLY_GAS_SAVINGS_CHANGE,
    FUEL_SAVINGS
} from 'dictionary'

const Reducer = (state = {}, action) => {
    switch (action.type) {
        case INCENTIVE_DATA_LOADED:
            return Object.assign({}, state, {
                incentiveServiceData: action.incentiveServiceData
            })
        case INCENTIVES_CHANGE:
            return Object.assign({}, state, {
                current: { ...action.payload }
            })

        case MONTHLY_GAS_SAVINGS_CHANGE:
            return Object.assign({}, state, {
                [FUEL_SAVINGS]: action.monthlyFuelSavings
            })

        default:
            return state
    }
}

export default Reducer
