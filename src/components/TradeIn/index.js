import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { _ } from 'third_party'
import { viewChange, fuelSavingsChange, taxIncentiveChange } from 'actions'
import { CALCULATOR, CALCULATE_MONTHLY_FUEL_SAVINGS, APP_NAME } from 'dictionary'
import { i18n } from 'utils'
import Header from '../Header'

class TradeIn extends Component {
    render() {
        const {
            onViewChange,
            headerLabel
        } = this.props
        return (
            <div className={'calculator--wrapper'}>
                <div className='calculator--container--tabs'>
                    <Header title={headerLabel} onViewChange={onViewChange} onBackView={CALCULATOR} />
                    <div className="tsla-side-panel--body">
                       TradeIn stuff goes here
                    </div>
                </div>
            </div>
        )
    }
}

TradeIn.propTypes = {
    context: PropTypes.string,
    onViewChange: PropTypes.func,
    headerLabel: PropTypes.string
}

function mapStateToProps(state) {
    const App = _.get(state, `${APP_NAME}/App`)
    const headerLabel = i18n('labels.tradein')

    return {
        context: App.context,
        headerLabel
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
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeIn)
