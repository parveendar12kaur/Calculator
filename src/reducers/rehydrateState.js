import _reduce from 'lodash/reduce'
import _merge from 'lodash/merge'
import _has from 'lodash/has'
import _get from 'lodash/get'

import Storage from '@web/tesla-utils/common/Storage'

import {
    CASH,
    LOCAL_STORAGE_KEY,
    APP_NAME,
    INTERNAL_CALC
} from 'dictionary'

import Layouts from './Layouts/InitialState'
import Values from './Values/InitialState'
import Terms from './Terms/InitialState'
import { initialState as FinanceSummary } from '../components/FinanceSummary/Reducer'

const initialState = {
    Layouts,
    Values,
    Terms,
    Location: {},
    FinanceSummary
}

/**
 * Returns rehydrated state
 * @param  {Object} params -- any params that might influence contextOverrides
 * @param  {Object} injections [injections from the server]
 * @return {Object} rehydrated state from injections, overrides, storage, etc...]
 */
export default (params, injections) => {
    /**
     * contextOverrides will enable any market/model/context specific InitialState overrides
     *
     * In an ideal situation (where we are able to get all the data and conditions to render
     * our app with associated market/model/context differences), this will basically be empty.
     * But... this is usually never the case,
     * so this pattern can enable us to easily make changes to the initial state of the app
     * by overriding specific Reducer properties per market / model / context
     * @type {Object}
     */
    const contextOverrides = {
        App: {
            market: {
                US: {
                    unitSystem: 'imperial'
                },
                GB: {
                    unitSystem: 'imperial'
                }
            }
        },
        Terms: {
            market: {
                US: {
                    financeType: CASH,
                    tradeInEnabled: true
                }
            }
        },
        Layouts: {
            market: {
                US: {
                    tradeInEnabled: true
                }
            },
            context: {
                [INTERNAL_CALC]: {
                    sidebar: false,
                    mainHeader: false
                }
            }
        },
        Location: {
            market: {
                US: {
                    // temporarily hardcode CA as default state
                    regionCode: 'CA'
                }
            }
        }
    }

    /**
     * This will allow us to rehydrate the calculator state from local storage
     */
    const storageOverrides = (() => {
        // if version does not match, then ignore the cache (2nd param of Storage.get is a
        // function that allows you to validate storage data, if you return false, cache will be null)
        const cache = Storage.get(LOCAL_STORAGE_KEY, data => _get(data, 'version') === params.version) || {};

        return cache
    })()

    const mergedState = _merge({}, initialState, injections)
    const deltaState = _reduce(mergedState, (result, val, key) => {
        if (_has(contextOverrides, key)) {
            // you can add other override keys here, like if there were specific overrides for model, variant, etc
            ['market', 'context'].forEach((param) => {
                const paramValue = params[param]
                if (_has(contextOverrides, `${key}.${param}.${paramValue}`)) {
                    result[key] = _merge({}, mergedState[key], contextOverrides[key][param][paramValue])
                }
            })
        }
        return result
    }, {})

    const rehydratedState = _merge(mergedState, deltaState, storageOverrides)

    // prepend APP_NAME to state or it will get discarded
    return _reduce(rehydratedState, (r, reducer, key) => {
        if (!key.includes(APP_NAME)) {
            r[`${APP_NAME}/${key}`] = reducer
        } else {
            r[key] = reducer
        }
        return r
    }, {})
}
