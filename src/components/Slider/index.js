import { Component } from 'react'
import PropTypes from 'prop-types'
import template from './template'

export default class Slider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: this.getProgress(props.min, props.max, props.selectedValue),
            value: props.selectedValue || props.min
        }

        this.onChange = this.onChange.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
    }

    getProgress(min, max, value) {
        const range = max - min
        return (Math.round(value - min) / range) * 100
    }

    onChange(e) {
        const { min, max } = this.props
        const value = parseFloat(e.target.value)
        const progress = this.getProgress(min, max, value)

        this.setState({
            progress,
            value
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedValue !== nextProps.selectedValue) {
            this.setState({
                progress: this.getProgress(this.props.min, this.props.max, nextProps.selectedValue),
                value: nextProps.selectedValue
            })
        }
    }

    onMouseUp(e) {
        this.props.onChange(this.props.id, parseFloat(e.target.value))
    }

    render() {
        const {
            label, min, max, step, formatValueLabel, valueLabel
        } = this.props

        const { progress, value } = this.state

        const inputProps = {
            min,
            max,
            step,
            value,
            className: 'tsla-input-range',
            onChange: this.onChange,
            onMouseUp: this.onMouseUp
        }

        let formattedValue
        if (valueLabel) {
            formattedValue = valueLabel(value);
        } else {
            formattedValue = formatValueLabel ? formatValueLabel(value) : value;
        }

        const style = {
            '--tsla-range-slider_track_active_progress': `${progress}%`,
            '--tsla-range_slider-progress-display': 'block'
        }

        return template({
            label, formattedValue, style, inputProps
        })
    }
}

Slider.defaultProps = {
    id: 'slider',
    min: 0,
    max: 10
}

Slider.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    selectedValue: PropTypes.number,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    step: PropTypes.number,
    formatValueLabel: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    valueLabel: PropTypes.func
}
