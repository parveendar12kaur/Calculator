import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { INTERNAL_CALC } from 'dictionary'
import { expandFinanceDetails } from 'actions'
import { getFinanceSummary } from 'selectors'
import { i18n } from 'utils'
import { formatCurrency } from '@web/tesla-lang'

const FinanceLineItem = ({
    context,
    type,
    label,
    value,
    formattedValue
}) => {
    const displayValue = formattedValue || value
    const defaultListItem = (<li className='list-item'>
        <span className="list-item--label">{label}</span><span className="list-item--value">{displayValue}</span>
    </li>)

    switch (context) {
        case INTERNAL_CALC:
            switch (type) {
                case 'title':
                    return <li className='list-item'><h4 className='list-item--title'>{label}</h4></li>
                case 'total':
                    return <li className='list-item list-item--total'>
                        <label className='list-item--label'>{label}</label><span className='list-item--value'>{displayValue}</span>
                    </li>
                default:
                    return defaultListItem
            }
        default:
            return defaultListItem
    }
}

FinanceLineItem.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    context: PropTypes.string
}

class FinanceSummary extends Component {
    render() {
        const {
            title,
            dueAtDeliveryTotal,
            items,
            context,
            expanded,
            depositAmount,
            expandDetailsHandler
        } = this.props

        return (
            <div className={`tsla-container calc--summary calc--summary--${context === INTERNAL_CALC ? 'internal' : 'configurator'}`}>
                <div className='calc--summary--col'>
                    <h4 className='calc--summary__title'>{title}</h4>
                    <div className='calc--summary__block--total'>
                        <If condition={expanded}>
                            <div className='calc--summary__subtitle'>{i18n('labels.finance_summary_subtitle')}</div>
                        </If>
                    </div>
                    <If condition={expanded}>
                        <ul className='calc--summary__list'>
                            {
                                items.map((item, i) => (
                                    <FinanceLineItem key={i} {...item} context={context} />
                                ))
                            }
                        </ul>
                    </If>
                    <h4 className='calc--summary__due-today tsla-text--large'>{formatCurrency(dueAtDeliveryTotal)}</h4>
                    <div className='calc--summary__subtitle'>
                        { i18n('labels.deposit_amount', { amount: formatCurrency(depositAmount) }) }
                    </div>
                    <span className='tsla-links--no_underline'>
                        <a onClick={expandDetailsHandler}>{i18n(expanded ? 'labels.hide_details' : 'labels.show_details')}</a>
                    </span>
                </div>
                <div className='calc--summary--col'>
                </div>
            </div>
        )
    }
}

FinanceSummary.propTypes = {
    context: PropTypes.string,
    expanded: PropTypes.bool,
    title: PropTypes.string,
    formattedPrice: PropTypes.string,
    dueTodayMessage: PropTypes.string,
    dueAtDeliveryTotal: PropTypes.number,
    items: PropTypes.array,
    disclaimer: PropTypes.string,
    expandDetailsHandler: PropTypes.func,
    depositAmount: PropTypes.number
}

function mapStateToProps(state) {
    return getFinanceSummary(state)
}

function mapDispatchToProps(dispatch) {
    return {
        expandDetailsHandler: () => dispatch(expandFinanceDetails())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinanceSummary)
