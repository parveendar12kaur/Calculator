import { LOCATION_CHANGE } from 'dictionary'

export default (state = {}, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            return Object.assign(state, {
                regionCode: action.regionCode
            })
        default:
            return state
    }
}

