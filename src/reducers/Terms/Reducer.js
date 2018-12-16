import {
    TERMS_CHANGE,
    FINANCE_TYPE_CHANGE,
    INITIAL_DATA_LOADED
} from 'dictionary'

import initialState from './InitialState'

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case INITIAL_DATA_LOADED:
            return Object.assign({}, state, {
                availableFinanceTypes: action.availableFinanceTypes,
                termsServiceData: action.termsServiceData
            })
        case TERMS_CHANGE:
            return Object.assign({}, state)
        case FINANCE_TYPE_CHANGE:
            return Object.assign({}, state, {
                financeType: action.financeType
            })
        default:
            return state
    }
}

export default Reducer
