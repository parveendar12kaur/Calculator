import { _ } from 'third_party'
import {
    CASH,
    APP_NAME,
    FINANCE_DETAILS_EXPAND,
    FINANCE_DETAILS_CHANGE
} from 'dictionary'
import { getStateSelectorKeys } from 'selectors'
/**
 * toggle detailed finance summary
 * @return {Object}
 */
export const expandFinanceDetails = () => ({
    type: FINANCE_DETAILS_EXPAND
})


/**
 * [financeDetailsChange description]
 * @return {[type]} [description]
 */
export function financeDetailsChange() {
    return (dispatch, getState) => {
        const state = getState()
        const {
            financeType, context
        } = getStateSelectorKeys(state)
        const postalCode = '94610'

        const values = _.get(state, `${APP_NAME}/Values`)[financeType]
        const vehiclePrice = _.get(state, `${APP_NAME}/Values.cash.vehiclePrice`)
        const term = financeType === CASH ? null : _.get(values, 'termInMonths')
        const fees = _.get(state, `${APP_NAME}/Fees.applied`)
        const totalFees = _.get(state, `${APP_NAME}/Fees.total`, 0)

        const { interestRate, estMonthlyPrice: estMonthlyPayment, downPayment } = values
        const dueAtDeliveryTotal = financeType === CASH ? vehiclePrice + totalFees : downPayment + totalFees
        const firstMonthsPayment = estMonthlyPayment
        const tradeInValue = 0
        const totalDownPayment = downPayment + tradeInValue
        const depositAmount = 2500 // hard-coded until we figure out where this is coming from
        const amountFinanced = -(vehiclePrice - parseFloat(dueAtDeliveryTotal))

        dispatch({
            type: FINANCE_DETAILS_CHANGE,
            dueTodayMessage:
            postalCode,
            amountFinanced,
            financeType,
            vehiclePrice,
            interestRate,
            downPayment,
            totalDownPayment,
            firstMonthsPayment,
            dueAtDeliveryTotal,
            depositAmount,
            estMonthlyPayment,
            fees,
            term,
            context
        })
    }
}
