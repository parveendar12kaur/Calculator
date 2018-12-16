import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { _ } from 'third_party'
import { viewChange, fuelSavingsChange, taxIncentiveChange, incentivesOptionsChange } from 'actions'
import { CALCULATOR, CALCULATE_MONTHLY_FUEL_SAVINGS, APP_NAME } from 'dictionary'
import { i18n } from 'utils'
import Header from '../Header'

import FuelSavings from '../FuelSavings'
import TaxIncentives from '../TaxIncentives'
import IncentivesSummary from '../IncentivesSummary'

class Incentives extends Component {
    render() {
        const {
            onViewChange,
            incentivesHeaderLabel,
            onFuelSavingsChangeHandler,
            context,
            onTaxIncentivesChangeHandler,
            onMonthlyPayOptionChangeHandler,
            incentivesSummaryProps,
            monthlyPriceWithIncentives
        } = this.props
        return (
            <div className={'calculator--wrapper'}>
                <div className='calculator--container--tabs'>
                    <Header title={incentivesHeaderLabel} onViewChange={onViewChange} onBackView={CALCULATOR} />
                    <div className="tsla-side-panel--body">
                        <FuelSavings context={context} onFuelSavingsChange={onFuelSavingsChangeHandler} />
                        <TaxIncentives onChange={onTaxIncentivesChangeHandler} context={context} />
                        <IncentivesSummary onChange={onMonthlyPayOptionChangeHandler} {...incentivesSummaryProps} monthlyPriceWithIncentives={monthlyPriceWithIncentives}/>
                    </div>
                </div>
            </div>
        )
    }
}

Incentives.propTypes = {
    context: PropTypes.string,
    onViewChange: PropTypes.func,
    incentivesHeaderLabel: PropTypes.string,
    onFuelSavingsChangeHandler: PropTypes.func,
    onTaxIncentivesChangeHandler: PropTypes.func
}

function mapStateToProps(state) {
    const App = _.get(state, `${APP_NAME}/App`)
    const incentivesHeaderLabel = i18n('labels.calculate_savings_label')

    const incentivesSummaryProps = _.get(state,`${APP_NAME}/Layouts.${App.context}.layouts.incentive.incentivesSummary.components[0].props`)
    const monthlyPriceWithIncentives = _.get(state,`${APP_NAME}/Incentive.current.monthlyPriceWithIncentives`)
    return {
        context: App.context,
        incentivesHeaderLabel,
        incentivesSummaryProps,
        monthlyPriceWithIncentives
    }
}


function mapDispatchToProps(dispatch) {
    return {
        onViewChange: (viewName) => {
            dispatch(viewChange(viewName))
        },
        onFuelSavingsChangeHandler: (name, value) => {
            dispatch(fuelSavingsChange({ name, value }))
            dispatch({ type: CALCULATE_MONTHLY_FUEL_SAVINGS })
        },
        onTaxIncentivesChangeHandler: (name, value) => {
            dispatch(taxIncentiveChange({ name, value }))
        },
        onMonthlyPayOptionChangeHandler: (name, value) => {
            dispatch(incentivesOptionsChange({ name, value }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Incentives)
