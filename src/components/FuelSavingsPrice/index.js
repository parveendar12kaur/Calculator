import React from 'react'
import PropTypes from 'prop-types'

const FuelSavingsPrice = (props) => {
    const {
        monthlyFuelSavings,
        fuelSavingsTitle
    } = props

    return (
        <div className='tsla-fuel-savings-info'>
            <h4>{fuelSavingsTitle}</h4>
            <div className="tsla-calc-list-unordered">
                <ul className='tsla-list--unordered'>
                    {
                        monthlyFuelSavings.savings.map((item, index) =>
                            <li key={index}>
                                <label>{item.label}</label>
                                <span>{item.value}</span>
                            </li>)
                    }
                </ul>
            </div>
            <div className="tsla-text--large">{monthlyFuelSavings.estMonthlyFuelSavings}</div>
            <div className="tsla-calc-hr-divider" ></div>
        </div>
    )
}

FuelSavingsPrice.propTypes = {
    monthlyFuelSavings: PropTypes.object,
    fuelSavingsTitle: PropTypes.string
}


export default FuelSavingsPrice
