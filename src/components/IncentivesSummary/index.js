import React from 'react'
import PropTypes from 'prop-types'

const IncentivesSummary = ({ header, subTitle, disclaimer, options, onChange, monthlyPriceWithIncentives }) => {

    return (
        <div className='tsla-container tsla-panel-card tsla-calc-incentives-summary'>
            <h4>{header}</h4>
            <label className='calc--form-item--label'>{subTitle}</label>
            <div className="tsla-form-item">
                {
                    options.map((option, index) => (
                        <label key={index} className="tsla-label tsla-label--inline">
                            <span className="tsla-label-name">{option.label}</span>
                            <span className="tsla-input-container">
                                <input
                                    type="checkbox"
                                    checked= {option.checked}
                                    value={option.value}
                                    onChange={() => onChange(option.value, !option.checked)}
                                    className="tsla-input-checkbox" />
                                <i className="tsla-input-icon_checkmark"> </i>
                            </span>
                        </label>
                    ))
                }
            </div>
            <div className='calc--price'>
                <span className='calc--price-value'>{monthlyPriceWithIncentives}</span>
                <div className='calc--disclaimer tsla-text--small'>{disclaimer}</div>
            </div>

        </div>
    )
}

IncentivesSummary.propTypes = {
    header: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    disclaimer: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    monthlyPriceWithIncentives: PropTypes.string.isRequired
}

export default IncentivesSummary
