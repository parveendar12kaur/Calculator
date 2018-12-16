import React from 'react'
import PropTypes from 'prop-types'
import Expandable from '../Expandable'

const Summary = (props) => {
    const { title, formattedPrice, dueTodayMessage } = props
    return (
        <div className='calc--summary'>
            <h4 className='calc--header-medium'>{title}</h4>
            <div className='calc-header-large'>{formattedPrice}</div>
            <div className='calc-disclaimer'>{dueTodayMessage}</div>
            <Expandable label="Show Details">
            </Expandable>
        </div>
    )
}

Summary.propTypes = {
    title: PropTypes.string,
    formattedPrice: PropTypes.string,
    dueTodayMessage: PropTypes.string
}

export default Summary
