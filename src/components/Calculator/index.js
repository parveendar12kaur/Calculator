import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _get from 'lodash/get'

import { APP_NAME, CASH } from 'dictionary'
import { termsChange, financeTermChange, viewChange, estMonthlyPriceChange } from 'actions'
import { i18n, getEstFinalAmount, getEstAmountAfterIncentives } from 'utils'
import Tabs from '../Tabs'
import AfterIncentivesPrice from '../AfterIncentivesPrice'
import FinanceSummary from '../FinanceSummary'
import DynamicComponentLayout from '../DynamicComponentLayout'
import CalculateSavings from '../CalculateSavings'
import EstMonthlyPrice from '../EstMonthlyPrice'

class Calculator extends Component {
    render() {
        const {
            tabs,
            context,
            financeType,
            financeTermChangeHandler,
            onTermsChangeHandler,
            formattedPrice,
            onViewChange,
            incentivesAnchorLabel,
            priceDisclaimer,
            displayRule,
            onEstMonthlyPriceChange,
            estPriceAfterIncentives
        } = this.props

        return (
            <div className={'calculator--wrapper'}>
                <div className='calculator--container--tabs'>
                    <Tabs
                        selectedTab={financeType}
                        tabs={tabs}
                        onClick={financeTermChangeHandler}
                    >
                        <EstMonthlyPrice formattedPrice={formattedPrice} onChange={onEstMonthlyPriceChange} displayAccess={displayRule}/>
                        <AfterIncentivesPrice afterIncentivesPrice={estPriceAfterIncentives}
                            disclaimer={priceDisclaimer} displayAccess={displayRule}/>
                        <CalculateSavings onViewChange={onViewChange} label={incentivesAnchorLabel} displayAccess={displayRule}/>
                        <DynamicComponentLayout context={context} onTermsChange={onTermsChangeHandler}/>
                        <FinanceSummary />
                    </Tabs>
                </div>
            </div>
        )
    }
}


Calculator.propTypes = {
    tabs: PropTypes.array,
    context: PropTypes.string,
    financeType: PropTypes.oneOf(['cash', 'lease', 'loan']),
    financeTermChangeHandler: PropTypes.func,
    onTermsChangeHandler: PropTypes.func,
    formattedPrice: PropTypes.string,
    onViewChange: PropTypes.func,
    incentivesAnchorLabel: PropTypes.string,
    priceDisclaimer: PropTypes.string,
    displayRule: PropTypes.bool,
    onEstMonthlyPriceChange: PropTypes.func,
    estPriceAfterIncentives: PropTypes.string
}


function mapStateToProps(state) {
    const { financeType } = _get(state, `${APP_NAME}/Values`)
    const Terms = _get(state, `${APP_NAME}/Terms`)
    const App = _get(state, `${APP_NAME}/App`)
    const { availableFinanceTypes } = Terms
    const tabs = availableFinanceTypes.reduce((r, fType) => {
        r.push({
            id: fType,
            label: i18n(`labels.${fType}`)
        })
        return r
    }, [])

    const formattedPrice = getEstFinalAmount(state)
    const estPriceAfterIncentives = getEstAmountAfterIncentives(state)
    const incentivesAnchorLabel = i18n('labels.incentivesAnchorLabel')

    // Price disclaimer based on the finance type
    const priceDisclaimer = financeType === CASH ? i18n('labels.cash_price_disclaimer') : i18n('labels.incentives_price_disclaimer')

    // Attribute to show/hide particular fields based on the finance type(Mainly to hide some labels when it is cash)
    // Boolean value
    const displayRule = financeType !== CASH

    return {
        context: App.context,
        financeType,
        formattedPrice,
        tabs,
        incentivesAnchorLabel,
        priceDisclaimer,
        displayRule,
        estPriceAfterIncentives
    }
}


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        financeTermChangeHandler: ({ id }) => {
            dispatch(financeTermChange({ financeType: id }))
        },
        onEstMonthlyPriceChange: (value) => {
            dispatch(estMonthlyPriceChange(value))
        }
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { financeType } = stateProps
    const { dispatch } = dispatchProps;

    return Object.assign({}, stateProps, ownProps, dispatchProps, {
        onTermsChangeHandler: (term, value) => {
            dispatch(termsChange({ financeType, term, value }))
        },

        onViewChange: (viewName) => {
            dispatch(viewChange(viewName))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Calculator)
