import React from 'react'
import PropTypes from 'prop-types'

const IncentiveMonthlyPayment = ({ header, subTitle, estMonthlyAmount, disclaimer, options, onChange }) => {
    
    return (
        <div className='tsla-form-item'>
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
                            </span>
                        </label>
                    ))
                }
            </div>
            <div className='calc--price'>
                <span className='calc--price-value'>{estMonthlyAmount}</span>
                <div className='calc--disclaimer tsla-text--small'>{disclaimer}</div>
            </div>
            
        </div>
    )
}

IncentiveMonthlyPayment.propTypes = {
    header: PropTypes.string.isRequired, 
    subTitle: PropTypes.string.isRequired, 
    estMonthlyAmount: PropTypes.string.isRequired, 
    disclaimer: PropTypes.string, 
    options: PropTypes.array.isRequired, 
    onChange: PropTypes.func.isRequired
}

export default IncentiveMonthlyPayment
