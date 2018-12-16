import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { _ } from 'third_party'
import { i18n } from 'utils'
import { formatCurrency, formatMonthlyPrice } from '@web/tesla-lang'
import { APP_NAME, FUEL_SAVINGS } from 'dictionary'
import Slider from '../Slider'
import FuelSavingsPrice from '../FuelSavingsPrice';


const componentMap = {
    Slider
}

class FuelSavings extends Component {
    render() {
        const {
            components,
            onFuelSavingsChange,
            monthlyIncentivesFuelSavings,
            estMonthlyGasSavingsTitle
        } = this.props
        return (
            <div className='tsla-calc-fuel-savings--layout'>
                <div className="tsla-panel-card tsla-container tsla-calc-container">
                    {
                        components.map((component) => {
                            const props = {
                                id: component.id,
                                formatValueLabel: formatCurrency,
                                onChange: onFuelSavingsChange,
                                ...component.props
                            }
                            const DynamicComponent = componentMap[component.component]

                            return <DynamicComponent key={`component-${component.id}`} {...props} />
                        })
                    }
                </div>

                <div className="tsla-calc-fuel-savings-price--layout tsla-container">
                    <FuelSavingsPrice fuelSavingsTitle={estMonthlyGasSavingsTitle} monthlyFuelSavings={monthlyIncentivesFuelSavings}/>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    const Values = _.get(state, `${APP_NAME}/Values.${[FUEL_SAVINGS]}`)
    const fuelSavings = _.get(state, `${APP_NAME}/Incentive.${[FUEL_SAVINGS]}`)
    const layout = _.get(state, `${APP_NAME}/Layouts.${ownProps.context}.layouts.incentive.fuelSavings`)

    const components = layout ? layout.components.reduce((r, component) => {
        let selectedValue = component.props.defaultValue
        if (_.has(Values, component.id) && !_.isNil(Values[component.id])) {
            selectedValue = Values[component.id]
        }
        r.push(Object.assign({}, component, {
            props: Object.assign({}, component.props, {
                selectedValue,
                label: _.isFunction(component.props.label) ? component.props.label(state) : component.props.label || ''
            })
        }))
        return r
    }, []) : []

    const estMonthlyGasSavingsTitle = i18n('labels.estMonthlyGasSavingsLabel')

    // Todo : Need to move this array to incentives layouts
    const monthlyIncentivesFuelSavings = {
        savings: [
            {
                label: i18n('labels.fuel_savings_gasoline_label'),
                value: formatCurrency(fuelSavings.monthlyFuelCost)
            }, {
                label: i18n('labels.fuel_savings_electricity_label'),
                value: formatCurrency(fuelSavings.monthlyKWhCost)
            }
        ],
        estMonthlyFuelSavings: formatMonthlyPrice(fuelSavings.monthlyFuelSavings, 'm')
    }
    return {
        onFuelSavingsChange: ownProps.onFuelSavingsChange,
        components,
        monthlyIncentivesFuelSavings,
        estMonthlyGasSavingsTitle
    }
}


FuelSavings.propTypes = {
    components: PropTypes.array,
    onFuelSavingsChange: PropTypes.func,
    monthlyIncentivesFuelSavings: PropTypes.object,
    estMonthlyGasSavingsTitle: PropTypes.string
}


export default connect(mapStateToProps)(FuelSavings)
