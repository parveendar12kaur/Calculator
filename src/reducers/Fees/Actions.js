import { _ } from 'third_party'
import Location from '@web/tesla-rest-location/api/location'
import {
    APP_NAME,
    FEES_DATA_LOADED,
    FINANCE_TYPE_CHANGE,
    FEES_CHANGE,
    LOCATION_CHANGE
} from 'dictionary'
import { getStateSelectorKeys, dataFilter } from 'selectors'
import { i18n } from 'utils'
import { formatCurrency } from '@web/tesla-lang'
import { financeDetailsChange } from 'actions'


export const buildFees = feesServiceData => (dispatch, getState) => {
    const { applied, total } = getFees(getState(), feesServiceData)

    dispatch({
        type: FEES_DATA_LOADED,
        feesServiceData,
        applied,
        total
    })
}

export const applyFees = (state) => {
    const feesServiceData = _.get(state, `${APP_NAME}/Fees.feesServiceData`)
    const { applied, total } = getFees(state, feesServiceData)
    return {
        type: FEES_CHANGE,
        applied,
        total
    }
}

export const feesChangeEpic = (action$, store) => action$.filter(action =>
    [
        FEES_DATA_LOADED,
        FINANCE_TYPE_CHANGE,
        FEES_CHANGE
    ].includes(action.type)).map((action) => {
    switch (action.type) {
        case FEES_DATA_LOADED:
        case FEES_CHANGE:
            return financeDetailsChange()
        case LOCATION_CHANGE:
        case FINANCE_TYPE_CHANGE:
            return applyFees(store.getState())
        default:
            return { type: 'NOOP' }
    }
})

function getFees(state, feesServiceData) {
    const feesSort = ['acquisitionFee', 'salesTax', 'registrationFee']
    const params = getStateSelectorKeys(state)
    const { regionCode, market } = params
    const stateMap = Location.getStateList(market) || {}
    const stateProvince = stateMap[regionCode] || i18n('labels.fees.estimated')

    // returns only fees that are currently applicable
    const applied = feesServiceData.filter(fee => dataFilter(params, fee)).reduce((r, { feeType, amount }) => {
        // remap fees for UI
        // State Sales Tax
        let label = feeType
        switch (feeType) {
            case 'salesTax':
                label = i18n('labels.fees.salesTax', { stateProvince })
                break
            case 'registrationFee':
                label = i18n('labels.fees.registrationFee', { stateProvince })
                break
            default:
                label = i18n(`labels.fees.${feeType}`)
        }

        r.push({
            type: 'line',
            id: feeType,
            label,
            formattedValue: formatCurrency(amount),
            value: amount
        })

        return r
    }, []).sort((a, b) => feesSort.indexOf(a.id) - feesSort.indexOf(b.id))

    const total = applied.reduce((r, fee) => {
        let add = r
        if (!Number.isNaN(parseFloat(fee.value))) {
            add += parseFloat(fee.value)
            return add
        }
        return add
    }, 0)

    return {
        applied,
        total
    }
}
