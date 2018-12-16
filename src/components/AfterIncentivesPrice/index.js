import React from 'react'
import PropTypes from 'prop-types'

const Price = (props) => {
    const { afterIncentivesPrice, disclaimer, displayAccess } = props
    return (
        <div className='tsla-calc-after-incentives'>
            {
                displayAccess ?
                    <div className='tsla-calc-after-incentives--label tsla-text--medium'>
                        {afterIncentivesPrice} {disclaimer}
                    </div>
                    : <div className='tsla-calc-after-incentives--label tsla-text--medium'>{disclaimer}</div>
            }
        </div>
    )
}

Price.propTypes = {
    afterIncentivesPrice: PropTypes.string,
    disclaimer: PropTypes.string,
    displayAccess: PropTypes.bool
}


export default Price
