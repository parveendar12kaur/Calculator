import { _ } from 'third_party'
import Storage from '@web/tesla-utils/common/Storage'
import { Observable } from 'rxjs/Rx'
import { ajax } from 'rxjs/observable/dom/ajax'
import { buildLayouts, buildIncentivesLayouts, buildFees } from 'actions'

import {
    APP_NAME,
    INIT_APPLICATION,
    PRICE_CHANGE,
    FINANCE_TYPE_CHANGE,
    PERSIST_STATE_CHANGE,
    LOCAL_STORAGE_KEY,
    TRANSLATIONS_LOADED,
    FUEL_SAVINGS_CHANGE,
    LOCATION_CHANGE
} from 'dictionary'


/**
 * Gets intial data from server
 * @return {thunk} @see redux-thunk
 */
export const getInitialResources = () => (dispatch, getState) => {
    const state = getState()
    const {
        terms_service_endpoint: termsServiceEndpoint,
        incentives_service_endpoint: incentivesServiceEndpoint,
        translations: translationsEndpoint,
        fees_service_endpoint: feesServiceEndpoint
    } = _.get(state, `${APP_NAME}/App.env`)

    const urls = [termsServiceEndpoint, translationsEndpoint, incentivesServiceEndpoint, feesServiceEndpoint]
    const requests = urls.map(url => ajax.getJSON(url))

    const obs = Observable
        .forkJoin(requests)
        .subscribe((response) => {
            const [termsServiceData, strings, incentivesServiceData, feesServiceData] = response
            dispatch({ type: TRANSLATIONS_LOADED, strings })
            dispatch(buildLayouts(termsServiceData))
            dispatch(buildIncentivesLayouts(incentivesServiceData))
            dispatch(buildFees(feesServiceData))
            obs.unsubscribe()
        })
}

export const initApp = () => (dispatch) => {
    dispatch({ type: INIT_APPLICATION })
    dispatch(getInitialResources())
}

export const persistStateEpic = (action$, store) =>
    action$.filter(action => [PRICE_CHANGE, FINANCE_TYPE_CHANGE, FUEL_SAVINGS_CHANGE, LOCATION_CHANGE].includes(action.type)).map(() => {
        const state = store.getState()
        Storage.set(LOCAL_STORAGE_KEY, {
            [`${APP_NAME}/Values`]: _.get(state, `${APP_NAME}/Values`),
            [`${APP_NAME}/Location`]: _.get(state, `${APP_NAME}/Location`)
        }, {
            version: _.get(state, `${APP_NAME}/App.version`)
        })
        return { type: PERSIST_STATE_CHANGE }
    })
