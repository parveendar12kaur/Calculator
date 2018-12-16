import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { _ } from 'third_party'

import { formatCurrency } from '@web/tesla-lang'

import { APP_NAME } from 'dictionary'
import Slider from '../Slider'
import Selector from '../Selector'
import TradeInButton from '../TradeIn/TradeInButton'

const componentMap = {
    Slider,
    Selector,
    TradeInButton
}

class DynamicComponentLayout extends Component {
    render() {
        const { components, onTermsChange } = this.props
        return (
            <div className='tsla-calc--terms-layout tsla-panel-card tsla-container tsla-calc-container'>
                {
                    components.map((component) => {
                        const props = {
                            id: component.id, formatValueLabel: formatCurrency, onChange: onTermsChange, ...component.props
                        }
                        const DynamicComponent = componentMap[component.component]

                        return <DynamicComponent key={`component-${component.id}`} {...props} />
                    })
                }
            </div>
        )
    }
}

DynamicComponentLayout.propTypes = {
    components: PropTypes.array,
    onTermsChange: PropTypes.func
}


function mapStateToProps(state, ownProps) {
    const { financeType } = _.get(state, `${APP_NAME}/Values`)
    const Values = _.get(state, `${APP_NAME}/Values.${financeType}`)
    const layout = _.get(state, `${APP_NAME}/Layouts.${ownProps.context}.layouts.calculator.${financeType}`)

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

    return {
        onTermsChange: ownProps.onTermsChange,
        components
    }
}


export default connect(mapStateToProps)(DynamicComponentLayout)
