import { INIT_DATA_LOADED } from 'actions'

const initialState = {
    unitSystem: 'metric'
}

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_DATA_LOADED:
            return Object.assign({}, state)
        default:
            return state
    }
}

export default Reducer
