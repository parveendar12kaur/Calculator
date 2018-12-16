import {
    FEES_DATA_LOADED,
    FEES_CHANGE
} from 'dictionary'

const Reducer = (state = {}, action) => {
    const { applied, total, feesServiceData } = action
    switch (action.type) {
        case FEES_DATA_LOADED:
            return Object.assign({}, state, {
                applied,
                total,
                feesServiceData
            })
        case FEES_CHANGE:
            return Object.assign({}, state, {
                applied,
                total
            })
        default:
            return state
    }
}

export default Reducer
