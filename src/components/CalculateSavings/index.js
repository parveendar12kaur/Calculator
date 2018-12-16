import React from 'react'
import { INCENTIVE } from 'dictionary'
import PropTypes from 'prop-types';

const CalculateSavings = (props) => {
    const { onViewChange, label, displayAccess } = props
    return (
        <div>
            <div className="tsla-text-center tsla-links--no_underline">
                <If condition={displayAccess}>
                    <a href="#" onClick={() => onViewChange(INCENTIVE)}>{label}</a>
                </If>
            </div>
            <div className="tsla-pd-20"> </div>
        </div>
    )
}


CalculateSavings.propTypes = {
    onViewChange: PropTypes.func,
    label: PropTypes.string,
    displayAccess: PropTypes.bool
}

export default CalculateSavings
