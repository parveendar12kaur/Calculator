import { _ } from 'third_party'
import { i18n, mapDefaultsToFinanceSchema } from 'utils'
import { formatNumber } from '@web/tesla-lang'

import {
    APP_NAME,
    TERMS_CHANGE,
    FINANCE_TYPE_CHANGE,
    INITIAL_DATA_LOADED,
    DOWNPAYMENT,
    TRADEIN,
    INTEREST_RATE,
    DISTANCE,
    TERM_IN_MONTHS,
    CASH,
    VIEW_CHANGE
} from 'dictionary'


// -- actions --

export const termsChange = ({ financeType, term, value }) => ({
    type: TERMS_CHANGE,
    financeType,
    term,
    value
})

export const financeTermChange = ({ financeType }) => ({
    type: FINANCE_TYPE_CHANGE,
    financeType
})


/**
 * Transforms service response into schema required by UI components
 * @param  {Object} termsServiceData [service response from terms service]
 * @return {thunk}
 */
export const buildLayouts = termsServiceData => (dispatch, getState) => {
    const state = getState()
    const layoutProps = mergeTermsIntoLayouts(state, { dispatch, termsServiceData })
    const defaultValues = getDefaultValues(state, { termsServiceData })
    dispatch({
        type: INITIAL_DATA_LOADED,
        context: _.get(state, `${APP_NAME}/App.context`),
        availableFinanceTypes: sortFinanceTypes(state, [CASH].concat(Object.keys(termsServiceData))),
        defaultValues,
        termsServiceData,
        layoutProps
    })
}

// -- helpers


/**
 * Sorts finance types according to expected order (can override-per-market in rehydrateState if needed)
 * @param  {Object} state
 * @param  {Array} availableFinanceTypes
 * @return {Array}
 */
function sortFinanceTypes(state, availableFinanceTypes) {
    const expectedFinanceTypeTabOrder = _.get(state, `${APP_NAME}/Terms.financeTypeOrder`)
    return expectedFinanceTypeTabOrder.reduce((r, financeType) => {
        if (availableFinanceTypes.includes(financeType)) {
            r.push(financeType)
        }
        return r
    }, [])
}

/**
 * Returns default values for each financeType and compiles them for Values reducer
 * @param  {Object} state                    [redux state]
 * @param  {Object} options.termsServiceData [terms service json response]
 * @return {Object}                          [mapped object with financeType defaultsd]
 */
function getDefaultValues(state, { termsServiceData }) {
    return _.reduce(termsServiceData, (r, product, financeType) => {
        r[financeType] = mapDefaultsToFinanceSchema(financeType, product.defaults)
        return r
    }, {})
}


/**
 * Returns schema required by component (specified by term), transformed from service data
 * @param  {String} term [finance term that you need to prepare props for]
 * @param  {String} data   [service response]
 * @return {Object}        [props for component]
 */
function getComponentProps(term, data) {
    let props = null

    switch (term) {
        case DOWNPAYMENT:

            props = _.omitBy({
                term: DOWNPAYMENT,
                label: i18n('labels.downpayment_label'),
                min: _.get(data, 'defaults.minimumDownPayment'),
                max: _.get(data, 'defaults.downPayment'),
                step: 100,
                maxPercent: _.get(data, 'defaults.maxPercent')
            }, _.isNil)

            break

        case INTEREST_RATE:

            props = _.omitBy({
                term: INTEREST_RATE,
                label: i18n('labels.interest_rate_label'),
                defaultValue: _.get(data, 'defaults.interestRate'),
                items: _.get(data, 'programOptions.interestRate', []).reduce((r, value) => {
                    r.push({
                        value,
                        label: i18n('labels.rate_item_label', { value })
                    })
                    return r
                }, [])
            }, _.isNil)

            break

        case DISTANCE:

            props = _.omitBy({
                term: DISTANCE,
                label: i18n('labels.distance_label'),
                defaultValue: _.get(data, 'defaults.distance'),
                items: _.get(data, 'programOptions.distance', []).reduce((r, value) => {
                    r.push({
                        value,
                        label: i18n('labels.distance_item_label', { value: formatNumber(value) })
                    })
                    return r
                }, [])
            }, _.isNil)
            break

        case TERM_IN_MONTHS:

            props = _.omitBy({
                term: TERM_IN_MONTHS,
                label: i18n('labels.terms_label'),
                defaultValue: _.get(data, 'defaults.termLength'),
                items: _.get(data, 'programOptions.termLength', []).reduce((r, value) => {
                    r.push({
                        value,
                        label: i18n('labels.term_item_label', { value })
                    })
                    return r
                }, [])
            }, _.isNil)

            break

        case TRADEIN:

            props = {
                term: TRADEIN,
                label: i18n('labels.tradein'),
                onClick: () => {
                    window.tesla.reducerRegistry.getStore().dispatch({
                        type: VIEW_CHANGE,
                        viewName: TRADEIN
                    })
                }
            }
            break
        default:
            console.warn('invalid term', term)
    }

    return _.isEmpty(props) ? null : props
}


function getFinanceComponentSpecs(financeType, data) {
    const possibleOptions = [DOWNPAYMENT, TRADEIN, INTEREST_RATE, DISTANCE, TERM_IN_MONTHS]

    return possibleOptions.reduce((r, key) => {
        const props = getComponentProps(key, data)
        if (props) {
            r.push({
                id: key,
                props
            })
        }
        return r
    }, [])
}

function mergeTermsIntoLayouts(state, { dispatch, termsServiceData }) {
    const tradeInEnabled = _.get(state, `${APP_NAME}/Layouts.tradeInEnabled`)
    const cashComponents = tradeInEnabled ? {
        components: [{
            id: TRADEIN,
            props: getComponentProps(TRADEIN, null, dispatch)
        }]
    } : null

    const response = {
        financeTypes: {
            [CASH]: cashComponents
        }
    }

    _.forOwn(termsServiceData, (product, key) => {
        response.financeTypes[key] = _.reduce(product, (r) => {
            r.components = getFinanceComponentSpecs(key, product)
            return r
        }, {})
    })

    return response
}
