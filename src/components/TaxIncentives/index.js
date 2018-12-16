import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { formatCurrency } from '@web/tesla-lang'
import { _ } from 'third_party'
import { APP_NAME } from 'dictionary'
import DropDown from '../Dropdown'

const TaxIncentiveLineItem = (props) => {
    const {
        id: key,
        label,
        value,
        dropDown,
        onChange
    } = props

    return (
        <Choose>
            <When condition={dropDown}>
                <li>
                    <label>{label}</label>
                    <span>{ formatCurrency(value)}</span>
                    <DropDown id={`${key}_dropdown`} {...dropDown} onChange={(id, val) => onChange(id, val)} / >
                </li>
            </When>
            <Otherwise>
                <li><label>{label}</label><span>{ formatCurrency(value)}</span></li>
            </Otherwise>
        </Choose>
    )
}

TaxIncentiveLineItem.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    dropDown: PropTypes.object,
    onChange: PropTypes.func
}

class TaxIncentives extends Component {
    render() {
        const {
            incentives,
            total,
            title,
            onChange
        } = this.props

        return (
            <div className='tsla-calc-tax-incentives--layout tsla-container'>
                <h4>{title}</h4>
                <div className="tsla-calc-list-unordered">
                    <ul className='tsla-list--unordered'>
                        {
                            incentives.map((props, index) =>
                                <TaxIncentiveLineItem
                                    id={`${props.id}`}
                                    onChange={ value => onChange('regionalIncentive', value)}
                                    key={index}
                                    {...props}
                                />)
                        }
                    </ul>
                </div>
                <div className="tsla-text--large">{total}</div>
            </div>
        )
    }
}

TaxIncentives.propTypes = {
    incentives: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    onChange: PropTypes.func
}


function mapStateToProps(state, ownProps) {
    const taxIncentives = _.get(state, `${APP_NAME}/Layouts.${ownProps.context}.layouts.incentive.taxIncentives`)
    const {
        incentives,
        label: title,
        total
    } = _.get(taxIncentives, 'components[0].props')

    const formattedTotal = formatCurrency(_.get(total, 'apply_once', 0))

    return {
        incentives,
        title,
        total: formattedTotal
    }
}


export default connect(mapStateToProps)(TaxIncentives)
