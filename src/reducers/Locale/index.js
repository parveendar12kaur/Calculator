import { TRANSLATIONS_LOADED } from 'dictionary'
import { _ } from 'third_party'

export const Reducer = (state = { strings: {} }, action) => {
    if (action.type === TRANSLATIONS_LOADED) {
        return {
            strings: _.merge({}, state.strings, action.strings)
        }
    }

    return state
}
