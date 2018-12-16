// note: using commas here

import { _ } from 'third_party'
import {
    OTHER,
    APP_NAME,
    FUEL,
    FUEL_SAVINGS,
    TAX_INCENTIVES
} from 'dictionary'
import { formatMonthlyPrice } from '@web/tesla-lang'
import { getStateSelectorKeys } from 'selectors'


/**
 * Notes: Not ready yet... TODO
 * Return values for all incentives that need to be displyed in UI in a single method
 * @param  {Object} params [description]
 * @return {Object}
 */
export function getIncentiveTotals(state) {

    const { context } = getStateSelectorKeys(state)
    const values = _.get(state, `${APP_NAME}/Values`)
    const incentiveServiceData = _.get(state, `${APP_NAME}/Incentive.incentiveServiceData`)
    const fuelIncentive = getFuelIncentive(incentiveServiceData)
    const { total: totalTaxIncentives } = getTaxIncentives(state, incentiveServiceData)
    const { monthlyFuelSavings, totalFuelSavings } = _.get(state, `${APP_NAME}/Incentive.fuelSavings`)

    // TODO get from lease terms instead
    const months = _.get(fuelIncentive, 'variables.months')
    const monthlyTaxIncentives = totalTaxIncentives.apply_once / months
    const monthlyVehiclePrice = _.get(values, 'current.estMonthlyPrice')

    // Change the monthly incentives price based on the options selected
    const incentivesOptions = _.get(state, `${APP_NAME}/Layouts.${context}.layouts.incentive.incentivesSummary.components[0].props.options`)
    let incentivesTotalMonthly = 0
    incentivesOptions.forEach((obj) => {
        if(obj.checked){
            if(obj.value === FUEL_SAVINGS)
                incentivesTotalMonthly += monthlyFuelSavings
            if(obj.value === TAX_INCENTIVES)
                incentivesTotalMonthly += monthlyTaxIncentives
        }
    })

    return {
        months,
        totalFuelSavings,
        totalTaxIncentives,
        incentivesTotalMonthly,
        monthlyPriceWithIncentives: formatMonthlyPrice(Math.round(monthlyVehiclePrice - incentivesTotalMonthly),'m')
    }
}

/**
 * Return true/false if incentive matches filter
 * @param  {String} fieldName [field name to check]
 * @param  {Object} params    [available filter parameters]
 * @param  {Object} incentive [incentive from service]
 * @return {Boolean}
 */
function incentiveFilter(fieldName, params, incentive) {
    if (params[fieldName] && incentive[fieldName]) {
        if (_.isArray(incentive[fieldName])) {
            return incentive[fieldName].includes(params[fieldName])
        }
        return incentive[fieldName] === 'any' ? true : incentive[fieldName] === params[fieldName]
    }
    return true
}

/**
 * Returns all regional incentives that are applicable for the current financeType
 * Maps them to component attributes
 * @param {*} state
 */
export function getComponentRegionalIncentives(state, incentivesData) {
    const vehicleOptions = []
    const selectedFinanceType = state[`${APP_NAME}/Values`].financeType
    const regionalIncentives = incentivesData.filter(incentive => (
        incentive.incentiveType === 'regional' && incentive.financeType.includes(selectedFinanceType)
    ))
    const componentIncentives = _.reduce(regionalIncentives, (r, incentive) => {
        const amount = (() => {
            if (_.has(incentive, 'toggle_amount.if.option') && vehicleOptions.length) {
                return getToggleAmount(state, incentive)
            }
            return incentive.amount
        })()
        r.push({
            label: incentive.long_name,
            value: incentive.regionCode,
            amount
        })
        return r
    }, [])

    return _.sortBy(componentIncentives, 'value')
}

/**
 * Returns Toggle Amount from incentive based on present options
 * @param  {Object} state     [redux state]
 * @param  {Object} incentive [incentive  definition from service]
 * @return {Number}           [incentive amount]
 */
function getToggleAmount(state, incentive) {
    const vehicleOptions = _.get(state, `${APP_NAME}/Configuration.options`, [])
    return (() => {
        // This will likely have to be changed a bit to account for whatever Ryan comes up with for a mapping here
        if (_.has(incentive, 'toggle_amount.if.option') && vehicleOptions.length) {
            const optMap = _.get(incentive, 'toggle_amount.if.option')
            const incentiveOpts = _.intersection(Object.keys(optMap), vehicleOptions)
            if (incentiveOpts.length) {
                return optMap[incentiveOpts[0]]
            }
            return incentive.amount
        }
        return incentive.amount
    })()
}

/**
 * Return fuel incentive
 * @param  {Object} incentiveServiceData
 * @return {Object}
 */
export function getFuelIncentive(incentiveServiceData) {
    return incentiveServiceData.find(incentive => incentive.incentiveType === FUEL)
}

/**
 * Returns all currently applicable tax incentives
 * @param {*} state
 */
export function getTaxIncentives(state, incentiveServiceData) {
    // state does not have incentiveServiceData the first time this is called.... hence the optional argument
    const incentivesData = incentiveServiceData || _.get(state, `${APP_NAME}/Incentive.incentiveServiceData`)
    const regionCode = _.get(state, `${APP_NAME}/Location.regionCode`, OTHER)
    const params = {
        regionCode,
        financeType: state[`${APP_NAME}/Values`].financeType
    }

    // Group incentives by incentiveType (filter out fuel incentive)
    const incentiveTypes = _.groupBy(incentivesData.filter(o => o.incentiveType !== 'fuel'), 'incentiveType')
    const filteredIncentives = _.reduce(incentiveTypes, (r, group) => {
        group.forEach((incentive) => {
            const remappedIncentive = Object.assign({}, incentive);
            // filter by financeType
            if (!incentiveFilter('financeType', params, remappedIncentive)) {
                return r;
            }
            // filter by region code
            if (!incentiveFilter('regionCode', params, remappedIncentive)) {
                return r;
            }
            // remap toggle amount if present
            if (remappedIncentive.toggle_amount) {
                _.set(remappedIncentive, 'amount', getToggleAmount(state, remappedIncentive))
            }

            r.push(remappedIncentive)
        })

        return r
    }, [])

    const totalIncentives = _.reduce(filteredIncentives, (r, incentive) => {
        if (incentive.rule) {
            if (!r[incentive.rule]) {
                r[incentive.rule] = 0
            }
            r[incentive.rule] += incentive.amount;
        }
        return r
    }, {})

    return {
        incentives: filteredIncentives,
        total: totalIncentives
    };
}

/**
 * Get params from state to pass to fuel calculation
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
export function getFuelCalcParams(state) {
    const fuelIncentive = getFuelIncentive(_.get(state, `${APP_NAME}/Incentive.incentiveServiceData`));
    const userValues = _.get(state, `${APP_NAME}/Values.fuelSavings`)
    const unitSystem = _.get(state, `${APP_NAME}/App.unitSystem`)
    let fuelEfficiency = _.get(userValues, 'fuelEfficiency')

    if (unitSystem === 'imperial') {
        fuelEfficiency = 1 / fuelEfficiency
    }

    return {
        fuelPrice: _.get(userValues, 'fuelCost'),
        fuelEfficiency,
        // user enters daily distance driven
        yearlyDistanceDriven: _.get(userValues, 'distanceDriven') * 365,
        kwhConsumption: _.get(fuelIncentive, 'variables.kwh_consumption'),
        kwhPrice: _.get(fuelIncentive, 'variables.kwh_price'),
        months: _.get(fuelIncentive, 'variables.months'),
        tollSavings: _.get(fuelIncentive, 'variables.toll_savings') || 0
    };
}


/**
 * TODO: Move to CalcJS (Senthil)
 * Calculates fuel savings
 * @param  {Object} params [fuel parameters]
 * @return {Object}        [description]
 */
export function calcFuelSavings(params) {
    const normalized = {};
    const requiredFields = [
        'fuelEfficiency',
        'yearlyDistanceDriven',
        'kwhConsumption',
        'kwhPrice',
        'fuelPrice',
        'months'
    ];

    // ensure required params
    const diff = _.difference(requiredFields, Object.keys(params));

    if (diff.length !== 0) {
        console.error('calcFuelSavings: missing required fields: ', diff.join());
    }

    _.forOwn(params, (value, key) => {
        // are all params numeric?
        if (!_.isNil(value) && !Number.isNaN(parseFloat(value))) {
            normalized[key] = parseFloat(value);
        } else {
            console.error('calcFuelSavings ', key, ' is not numeric');
        }
    })

    const {
        fuelEfficiency,
        // distance driven per year
        yearlyDistanceDriven,
        kwhConsumption,
        kwhPrice,
        fuelPrice,
        tollSavings = 0,
        months
    } = normalized;

    // -- Fuel Savings Calculation -------------------------------
    const distanceDriven = (yearlyDistanceDriven / 12) * months;
    const totalFuelCost = fuelEfficiency * distanceDriven * fuelPrice;
    const totalKWhCost = kwhConsumption * distanceDriven * kwhPrice;
    const monthlyKWhCost = totalKWhCost / months;
    const monthlyFuelCost = totalFuelCost / months;
    const totalFuelSavings = Math.abs((totalKWhCost - totalFuelCost) - tollSavings);
    const monthlyFuelSavings = totalFuelSavings / months;

    return {
        totalFuelCost,
        totalKWhCost: Math.round(totalKWhCost),
        totalFuelSavings: Math.round(totalFuelSavings),
        monthlyKWhCost: Math.round(monthlyKWhCost),
        monthlyFuelSavings: Math.round(monthlyFuelSavings),
        monthlyFuelCost: Math.round(monthlyFuelCost)
    };
}
