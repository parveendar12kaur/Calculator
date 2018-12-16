/* eslint import/no-extraneous-dependencies: off */

import moment from 'moment'
import { _ } from 'third_party'
import { reducerRegistry } from 'globals'
import { get as getString, formatCurrency, formatMonthlyPrice } from '@web/tesla-lang'
import {
    APP_NAME,
    CASH,
    DOWNPAYMENT,
    INTEREST_RATE,
    TERM_IN_MONTHS,
    DISTANCE
} from 'dictionary'


// cache
let translations

// ISO-8601 date
// get default version if version is not injected from server
export const getVersion = (version) => {
    const dteString = moment(new Date()).format('YYYYMMDD');
    return `${version}-${dteString}`
}

export const i18n = (key, vars) => {
    if (_.isEmpty(translations)) {
        const Locale = reducerRegistry.getState('Locale')
        translations = Locale.strings
    }

    return getString(key, vars, translations)
}

/**
 * Only returns fields that match those in defined schema for financeType
 * @param  {String} financeType [description]
 * @param  {Object} object      [object with populated with defaults data from terms service]
 * @return {Object}
 */
export const mapDefaultsToFinanceSchema = (financeType, object) => {
    const fields = {
        loan: [DOWNPAYMENT, INTEREST_RATE, { termLength: TERM_IN_MONTHS }],
        lease: [DOWNPAYMENT, INTEREST_RATE, DISTANCE]
    }

    const result = {}

    fields[financeType].forEach((term) => {
        // remapped fields
        if (_.isObject(term)) {
            const termName = Object.keys(term)[0]
            if (_.has(object, termName)) {
                result[term[termName]] = object[termName]
            }
        } else if (_.has(object, term)) {
            result[term] = object[term]
        }
    })

    return result
}


/**
 * Returns final estimated monthly price
 * @param {object} state
 * @returns {number}
 */
export const getEstFinalAmount = (state) => {
    const Values = _.get(state, `${APP_NAME}/Values`)

    switch (Values.financeType) {
        case CASH:
            return formatCurrency(Values.cash.vehiclePrice)
        default:
            return formatMonthlyPrice(_.get(Values, `${Values.financeType}.estMonthlyPrice`), 'm')
    }
}

/**
 * Returns final estimated price after incentives
 * @param {object} state
 * @returns {string}
 */
export const getEstAmountAfterIncentives = (state) => {
    const monthlyPriceWithIncentives = _.get(state, `${APP_NAME}/Incentive.current.monthlyPriceWithIncentives`)
    return formatMonthlyPrice(monthlyPriceWithIncentives)
}

/**
 * Convert snake to camel
 * @param  {String} str
 * @return {String}
 */
export const camelCase = (str) => {
    if (!str) { return str }
    return str.replace(/[_ ](.)/g, (m, $1) => $1.toUpperCase())
}

/**
 * Returns the object which will match the calcJS object with exact key names
 * @param state
 * @returns {{interestRate: *, vehiclePrice: *, financeType: *, downPayment: *, tradeInValue: number}}
 */

export function getEstPaymentCalcParams(state) {
    const financeType = _.get(state, `${APP_NAME}/Values.financeType`)
    const values = _.get(state, `${APP_NAME}/Values`)
    const currentValues = values[financeType]

    // Note :: Current calcJs is returning console errors for unkown variables
    // so just to avoid them creating an object as per the acceptable variable names
    // ToDO:: This is to match senthil's current setObject
    const variables = {
        interestRate: _.get(currentValues, 'interestRate'),
        vehiclePrice: _.get(values, 'subTotal'),
        financeType,
        downPayment: _.get(currentValues, 'downPayment'),
        // As trade-in not implemented passing 0
        tradeInValue: 0,
        termInMonths: _.get(currentValues, 'termInMonths')
    }
    return variables
}


// TODO:: This is just for testing as we don't have the formulae to calculate min and max values
// Need to perform actual checking using a formulae
/**
 * To validate the monthly price input value
 * @param value
 * @returns {boolean}
 */
export function validateMonthlyInputValue(value) {
    const min = 500
    const max = 1500
    return !(value > max || value < min);
}


export function getMonthlyPaymentErrorText(monthlyValue) {
    const min = 500
    const max = 1500
    const errorParser = (labelText, value) => i18n(labelText, { value })

    if (monthlyValue < min) {
        const translationsLabel = 'labels.estMonthlyPaymentInputMinError'
        return errorParser(translationsLabel, formatCurrency(min))
    }

    if (monthlyValue > max) {
        const translationsLabel = 'labels.estMonthlyPaymentInputMaxError'
        return errorParser(translationsLabel, formatCurrency(max))
    }
}
