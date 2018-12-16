/* eslint import/no-extraneous-dependencies: off */
import { _ } from 'third_party'
import { i18n, getEstPaymentCalcParams } from 'utils'
import { APP_NAME } from 'dictionary'
import { calcJS } from 'globals'

/**
 * Redux Selectors
 * Functions to simplify grabbing data from Redux state
 */

/**
 * Helper filter for iterating through incentives and fees data structures
 * @param  {Object} params    [object with values to filter obj on]
 * @param  {Object} obj       [object to reject or accept based on param values]
 * @return {Object}
 */
export const dataFilter = (params, data) => _.reduce(params, (r, value, key) => {
    // ensure we only apply filter when both params object and data record have the same field
    if (r && params[key] && data[key]) {
        // check if the data field is an array of values to match on
        if (_.isArray(data[key])) {
            return data[key].includes(params[key])
        }
        return data[key] === 'any' ? true : data[key] === params[key]
    }
    return r
}, true)


/**
 * Returns keys that are relevant in selecting parts of redux state
 * @param  {Object} state
 * @return {Object}
 */
export function getStateSelectorKeys(state) {
    const market = _.get(state, `${APP_NAME}/App.market`)
    const context = _.get(state, `${APP_NAME}/App.context`)
    const regionCode = _.get(state, `${APP_NAME}/Location.regionCode`)
    const financeType = _.get(state, `${APP_NAME}/Values.financeType`)

    return {
        market,
        context,
        regionCode,
        financeType
    }
}

/**
 * Returns Estimated Monthly Price for Lease and Loan from calcJS
 * @param state
 */
export function getEstMonthlyPrice(state) {
    const variables = getEstPaymentCalcParams(state)
    // Set variables in calcJS to calculate estimate monthly price
    const result = calcJS.calculatePayment(variables)
    return result
}

/**
 * Selects data relevant to rendering the financial summary
 * TODO: Internal Calculator Scenarios still need some work
 *
 * @param  {Object} state [redux state]
 * @return {Object}       [description]
 */
export function getFinanceSummary(state) {
    const { financeType, context } = getStateSelectorKeys(state)
    const { expanded } = _.get(state, `${APP_NAME}/FinanceSummary`)
    const { items, dueAtDeliveryTotal, depositAmount } = _.get(state, `${APP_NAME}/FinanceSummary.current`)
    const sortOrder = ['vehiclePrice', 'destinationAndDocFee', 'salesTax', 'registrationFee', 'amountFinanced']

    return {
        title: i18n('labels.finance_summary_title'),
        context,
        expanded,
        depositAmount,
        dueAtDeliveryTotal,
        items: items.filter(item => dataFilter({ financeType }, item)).sort((a, b) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id))
    }
}
