import React from 'react'
import PropTypes from 'prop-types'

const TradeInButton = ({ label, onClick }) => (
    <div className='tsla-form-item tradein--button'>
        <span className='label'>{label}</span>
        <button className='tsla-btn tsla-btn--xsmall tsla-calc-tradein_button' onClick={onClick}>Get Quote</button>
    </div>
)

TradeInButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default TradeInButton
