import { _ } from 'third_party'
import { i18n } from 'utils'
import { empty } from 'rxjs/observable/empty'
import {
    APP_NAME,
    INCENTIVE_DATA_LOADED,
    FUEL_EFFICIENCY,
    DISTANCE_DRIVEN,
    FUEL_COST,
    FUEL_SAVINGS_CHANGE,
    TAX_INCENTIVE_CHANGE,
    CALCULATE_MONTHLY_FUEL_SAVINGS,
    FUEL_SAVINGS,
    TAX_INCENTIVES,
    INCENTIVES_CHANGE,
    LOCATION_CHANGE,
    FINANCE_TYPE_CHANGE,
    MONTHLY_GAS_SAVINGS_CHANGE,
    TERMS_CHANGE,
    INCENTIVES_SUMMARY,
    CALCULATE_INCENTIVES_MONTHLY_PAYMENT,
    INCENTIVES_SUMMARY_CHANGE,
    INCENTIVES_OPTIONS_CHANGE
} from 'dictionary'
import * as IncentiveUtil from '../../common/IncentivesUtil'


export const incentiveChangeEpic = (action$, store) =>
    action$.filter(action => [
        LOCATION_CHANGE,
        FINANCE_TYPE_CHANGE,
        MONTHLY_GAS_SAVINGS_CHANGE,
        TAX_INCENTIVE_CHANGE,
        TERMS_CHANGE,
        CALCULATE_INCENTIVES_MONTHLY_PAYMENT,
        INCENTIVES_OPTIONS_CHANGE
    ].includes(action.type)).map((action) => {
        const state = store.getState()
        const context = _.get(state, `${APP_NAME}/App.context`)

        switch (action.type) {
            case LOCATION_CHANGE:
            case FINANCE_TYPE_CHANGE:
                return {
                    type: TAX_INCENTIVE_CHANGE,
                    context,
                    payload: IncentiveUtil.getIncentiveTotals(state),
                    layoutProps: mergeIncentivesIntoLayouts(state, {
                        incentiveServiceData: _.get(state, `${APP_NAME}/Incentive.incentiveServiceData`)
                    })
                }
            case MONTHLY_GAS_SAVINGS_CHANGE:
            case TAX_INCENTIVE_CHANGE:
            case TERMS_CHANGE:
            case CALCULATE_INCENTIVES_MONTHLY_PAYMENT:
                return {
                    type: INCENTIVES_CHANGE,
                    payload: IncentiveUtil.getIncentiveTotals(state)
                }

            case INCENTIVES_OPTIONS_CHANGE:
                let options = _.get(state, `${APP_NAME}/Layouts.${context}.layouts.incentive.incentivesSummary.components[0].props.options`)
                options.map((option, index) => {
                    if(option.value === action.name){
                        option.checked = action.value
                    }
                    return option
                })
                return {
                    type: INCENTIVES_SUMMARY_CHANGE,
                    context,
                    options
                }
            default:
        }
        // return no-op for observable
        return empty()
    })


export const fuelSavingsChange = ({ name, value }) => ({
    type: FUEL_SAVINGS_CHANGE,
    name,
    value
})

export const incentivesOptionsChange = ({ name, value }) => (dispatch) => {
    dispatch({
        type: INCENTIVES_OPTIONS_CHANGE,
        name,
        value
    })
    dispatch({
        type: CALCULATE_INCENTIVES_MONTHLY_PAYMENT
    })
}


// TODO: change now
export const taxIncentiveChange = ({ name, value }) => (dispatch) => {
    dispatch({
        type: LOCATION_CHANGE,
        incentiveType: name,
        regionCode: value
    })
}

/**
 * Transforms service response into schema required by UI components
 * @param  {Object} incentiveServiceData [service response from incentives service]
 * @return {thunk}
 */
export const buildIncentivesLayouts = incentiveServiceData => (dispatch, getState) => {
    const state = getState()
    const layoutProps = mergeIncentivesIntoLayouts(state, { incentiveServiceData })
    const defaultValues = getDefaultValues(state, { incentiveServiceData })

    dispatch({
        type: INCENTIVE_DATA_LOADED,
        context: _.get(state, `${APP_NAME}/App.context`),
        defaultValues,
        incentiveServiceData,
        layoutProps
    })
    dispatch({ type: CALCULATE_MONTHLY_FUEL_SAVINGS })
    dispatch({ type: CALCULATE_INCENTIVES_MONTHLY_PAYMENT })
}

// -- helpers

function getDefaultValues(state, { incentiveServiceData }) {
    /*
        Used this const as we we have change the path of default variables object in one place
        if it gets changed in the final contract
     */
    const defaultData = incentiveServiceData.find(incentive => incentive.incentiveType === 'fuel').variables
    return {
        [FUEL_SAVINGS]: {
            fuelEfficiency: defaultData.default_fuel_efficiency,
            distanceDriven: defaultData.default_distance_driven,
            fuelCost: defaultData.fuel_price
        }
    }
}


/**
 * Returns schema required by component (specified by savings), transformed from incentives service data
 * @param  {String} fuelSavingsType [fuelSavingsType that you need to prepare props for]
 * @param  {String} data   [service response]
 * @return {Object}        [props for component]
 */
function getComponentProps(state, componentType, data) {
    let props = null
    const fuelData = data.variables
    const taxIncentivesData = (data.variables || data[FUEL_SAVINGS])? null : IncentiveUtil.getTaxIncentives(state, data)

    switch (componentType) {
        case FUEL_EFFICIENCY:

            props = {
                term: FUEL_EFFICIENCY,
                label: i18n('labels.fuel_efficiency_label'),
                min: _.get(fuelData, 'min_fuel_efficiency'),
                max: _.get(fuelData, 'max_fuel_efficiency'),
                maxPercent: _.get(fuelData, 'max_fuel_efficiency'),
                valueLabel: value => i18n('labels.fuel_efficiency_value_label', { value })
            }

            break

        case DISTANCE_DRIVEN:

            props = {
                term: DISTANCE_DRIVEN,
                label: i18n('labels.distance_driven_label'),
                min: _.get(fuelData, 'min_distance_driven'),
                max: _.get(fuelData, 'max_distance_driven'),
                maxPercent: _.get(fuelData, 'max_distance_driven'),
                valueLabel: value => i18n('labels.distance_driven_value_label', { value })
            }

            break

        case FUEL_COST:

            props = {
                term: FUEL_COST,
                label: i18n('labels.fuel_savings_gasoline_label'),
                min: _.get(fuelData, 'min_fuel_price'),
                max: _.get(fuelData, 'max_fuel_price'),
                maxPercent: _.get(fuelData, 'max_fuel_price')
            }

            break

        case TAX_INCENTIVES:

            props = {
                term: TAX_INCENTIVES,
                label: i18n('labels.tax_incentives_label'),
                total: taxIncentivesData.total,
                incentives: taxIncentivesData.incentives.reduce((r, incentive) => {
                    r.push({
                        label: i18n(`labels.tax_incentive_${incentive.incentiveType}`),
                        value: _.get(incentive, 'amount'),
                        dropDown: incentive.incentiveType === 'regional' ? {
                            items: IncentiveUtil.getComponentRegionalIncentives(state, data)
                        } : null
                    })
                    return r
                }, [])
            }

            break

        case INCENTIVES_SUMMARY:
            const options = [FUEL_SAVINGS, TAX_INCENTIVES]
            props = {
                term: INCENTIVES_SUMMARY,
                header: i18n('labels.monthly_payment_total'),
                subTitle: i18n('labels.include_label'),
                disclaimer: i18n('labels.incentives_disclaimer'),
                options: options.reduce((r, key) => {
                    if(data[key]){
                        r.push({
                            label: i18n(`labels.incentives_options_${key}`),
                            value: key,
                            checked: true
                        })
                    }
                    return r
                }, [])
            }
            break

        default:
            console.warn('invalid Incentive', componentType)
    }

    return _.isEmpty(props) ? null : props
}


function getComponentSpecs(state, incentiveType, data) {
    const components = {
        [FUEL_SAVINGS]: [FUEL_EFFICIENCY, DISTANCE_DRIVEN, FUEL_COST],
        [TAX_INCENTIVES]: [TAX_INCENTIVES],
        [INCENTIVES_SUMMARY]: [INCENTIVES_SUMMARY]
    }[incentiveType]

    return components.reduce((r, field) => {
        const props = getComponentProps(state, field, data)
        if (props) {
            r.push({
                id: field,
                props
            })
        }
        return r
    }, [])
}

function mergeIncentivesIntoLayouts(state, { incentiveServiceData }) {
    const response = {
        type: {}
    }

    const fuelIncentive = IncentiveUtil.getFuelIncentive(incentiveServiceData)
    const { incentives: taxIncentives } = IncentiveUtil.getTaxIncentives(state, incentiveServiceData)
    const incentivesSummary = { fuelSavings: fuelIncentive, taxIncentives}

    _.forOwn({
        [FUEL_SAVINGS]: fuelIncentive,
        [TAX_INCENTIVES]: taxIncentives,
        [INCENTIVES_SUMMARY]: incentivesSummary
    }, (incentive, incentiveType) => {
        const components = (() => {
            if (incentiveType === TAX_INCENTIVES) {
                return getComponentSpecs(state, incentiveType, incentiveServiceData)
            }
            return getComponentSpecs(state, incentiveType, incentive)
        })()

        response.type[incentiveType] = {
            components
        }
    })

    return response
}
