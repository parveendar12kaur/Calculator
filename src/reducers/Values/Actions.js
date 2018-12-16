/* eslint import/no-extraneous-dependencies: off */

import { _ } from 'third_party'
import { calcJS } from 'globals'
import { empty } from 'rxjs/observable/empty'
import { formatCurrency } from '@web/tesla-lang'
import {
    APP_NAME,
    CONFIGURATION_CHANGE,
    PRICE_CHANGE,
    FINANCE_TYPE_CHANGE,
    TERMS_CHANGE,
    CALCULATING_PRICE,
    CASH, LEASE, LOAN,
    EST_MONTHLY_PRICE_CHANGE,
    MONTHLY_GAS_SAVINGS_CHANGE,
    CALCULATE_MONTHLY_FUEL_SAVINGS,
    CALCULATE_ESTIMATED_MONTHLY_PAY,
    ESTIMATED_MONTHLY_PAY_CHANGE
} from 'dictionary';
import { termsChange } from 'actions';

// Epics
export const priceChangeEpic = action$ =>
    action$.filter(action => [
        CONFIGURATION_CHANGE,
        CALCULATING_PRICE,
        FINANCE_TYPE_CHANGE,
        TERMS_CHANGE,
        EST_MONTHLY_PRICE_CHANGE,
        CALCULATE_MONTHLY_FUEL_SAVINGS,
        CALCULATE_ESTIMATED_MONTHLY_PAY
    ].includes(action.type)).map((action) => {
        switch (action.type) {
            case CONFIGURATION_CHANGE:
                return {
                    type: CALCULATING_PRICE,
                    subTotal: action.subTotal,
                    options: action.currentOptions
                }
            case FINANCE_TYPE_CHANGE:
                return calculateVehiclePrice()
            case TERMS_CHANGE:
                return calculateVehiclePrice()
            case CALCULATING_PRICE:
                return calculateVehiclePrice('subTotal')
            case EST_MONTHLY_PRICE_CHANGE:
                return changeInMonthlyPrice(action)
            case CALCULATE_MONTHLY_FUEL_SAVINGS:
                return calculateMonthlyFuelSavingsPrice()
            case CALCULATE_ESTIMATED_MONTHLY_PAY:
                    return calculateEstimatedMonthlyPay(action)
            default:
        }
        return empty()
    })


// Actions
export const priceChange = calculatedValues => ({
    type: PRICE_CHANGE,
    calculatedValues
})

export const estMonthlyPriceChange = value => ({
    type: EST_MONTHLY_PRICE_CHANGE,
    value
})


function calculateVehiclePrice() {
    return (dispatch, getState) => {
        const state = getState()
        const financeType = _.get(state, `${APP_NAME}/Values.financeType`)
        const vehiclePrice = _.get(state, `${APP_NAME}/Values.cash.vehiclePrice`)

        let estMonthlyPrice
        let valueObject = {}

        calcJS.set('vehiclePrice', vehiclePrice)

        // if (arguments.length === 1) {
        //     // if propertyName is an object path, then strip off rest of path so it can be used in calcJS
        //     const parts = propertyName.split('.')
        //     varName = parts.length > 1 ? parts.slice(1).join('.') : parts.join('')
        // }

        switch (financeType) {
            case CASH:
                valueObject = { vehiclePrice }
                break
            case LEASE:
            case LOAN:
                estMonthlyPrice = getEstMonthlyPrice(state)
                valueObject = { estMonthlyPrice }
                break
            default:
        }

        dispatch(priceChange(valueObject))
    }
}



function getEstMonthlyPrice(state) {
    const financeType = _.get(state, `${APP_NAME}/Values.financeType`)
    const currentValues = _.get(state, `${APP_NAME}/Values.${financeType}`)
    currentValues.financeType = financeType

    // Temporary fix
    currentValues[`${financeType}TermInMonths`] = currentValues.termInMonths

    calcJS.setObject(currentValues)
    return calcJS.get('estMonthlyPrice')
}

function changeInMonthlyPrice() {
    return (dispatch) => {
        const financeType = 'loan'
        const term = 'downPayment'
        const value = 2200
        dispatch(termsChange({ financeType, term, value }))
    }
}

// Todo:: This needs to be a common function to calculate incentives price using calcJS library later on
function calculateMonthlyFuelSavingsPrice() {
    return (dispatch, getState) => {
        const state = getState()
        const fuelSavings = _.get(state, `${APP_NAME}/Values.fuelSavings`)

        // Todo: This is a dummy calculation for testing,
        // These results will be from calcJS billing engine library
        const gasolineCost = Math.round((fuelSavings.distanceDriven * 30) / fuelSavings.currentMiles) * fuelSavings.fuelCost
        const electricityCost = Math.round((fuelSavings.distanceDriven * 30) / fuelSavings.currentMiles) * 0.34
        const estMonthlyGasSavingsPrice = Math.round(gasolineCost - electricityCost)

        const monthlyFuelSavings = {
            gasolineCost,
            electricityCost,
            estMonthlyGasSavingsPrice
        }
        dispatch({
            type: MONTHLY_GAS_SAVINGS_CHANGE,
            monthlyFuelSavings
        })
    }
}

function calculateEstimatedMonthlyPay(action){
    return(dispatch, getState) =>{
        const state = getState()
        const App = _.get(state, `${APP_NAME}/App`)
        let options = _.get(state, `${APP_NAME}/Layouts.${App.context}.layouts.incentive.estimatedMonthlyPay.components[0].props.options`)
        // calculate estimated monthly pay 
        const  estimatedMonthlyPay = '$825 /mo'
        options.map((option, index) => {
            if(option.value === action.name){
                option.checked = action.value
            }
            return option
        })
        
        dispatch({
            type: ESTIMATED_MONTHLY_PAY_CHANGE,
            context: App.context,
            estimatedMonthlyPay,
            options
        })
    }
}
