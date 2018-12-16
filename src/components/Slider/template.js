import React from 'react'
import PropTypes from 'prop-types'

const Slider = ({
    label,
    style,
    inputProps,
    formattedValue
}) => (
    <div className="tsla-form-item tsla-range_slider">
        <label className="tsla-label">
            <span className="tsla-label-name">{label}</span>
            <span className="tsla-range_slider_progress_value tsla-text--medium-bold">{ formattedValue }</span>
            <span className="tsla-input-container" style={style}>
                <input type="range" {...inputProps} />
            </span>
        </label>
    </div>
)

Slider.propTypes = {
    label: PropTypes.string,
    style: PropTypes.string,
    formattedValue: PropTypes.string,
    inputProps: PropTypes.object
}

export default Slider
