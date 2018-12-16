import React from 'react'
import PropTypes from 'prop-types'

const Selector = ({
    label, term, selectedValue, onChange, items, id
}) => {
    const selectedIndex = items.findIndex(item => item.value === selectedValue)
    const offsetWidth = 100 / items.length
    const labelStyle = {
        '--tsla-switch_group-slider-label-width': `${offsetWidth}%`
    }
    const sliderStyle = {
        '--tsla-switch_group-slider-position': `${offsetWidth * selectedIndex}%`,
        '--tsla-switch_group-slider-label-width': `${offsetWidth}%`
    }

    return (
        <div className='tsla-form-item' id = {id}>
            <label className='calc--form-item--label'>{label}</label>
            <label className="tsla-label">
                <span className="tsla-input-container">
                    <div className="tsla-switch_group">
                        {
                            items.map((item, index) =>
                                <label key={index} className="tsla-label" style={labelStyle}>
                                    <input
                                        type= "radio"
                                        checked={selectedValue === item.value}
                                        className="tsla-switch_group--option"
                                        name={ id }
                                        onChange={() => onChange(term, item.value)}
                                        value={item.value} />
                                    <span className="tsla-label-name">{item.label}</ span >
                                </label >)
                        }
                        <div className="tsla-switch_group--slider" style={sliderStyle}></div >
                    </div>
                </span>
            </label>
        </div>
    )
}

Selector.propTypes = {
    term: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    items: PropTypes.array,
    selectedValue: PropTypes.number,
    onChange: PropTypes.func.isRequired

}

export default Selector
