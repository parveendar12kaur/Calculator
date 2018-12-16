import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Dropdown extends Component {
    constructor(props) {
        super(props)
        this.onChangeOfSelection = this.onChangeOfSelection.bind(this)
        this.state = {
            value: props.selectedValue || ''
        }
    }

    onChangeOfSelection(e) {
        const { value } = e.target

        this.setState({
            value
        })

        // Call onChange
        this.props.onChange(value)
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.selectedValue !== nextProps.selectedValue) {
            this.setState({
                value: nextProps.selectedValue
            })
        }
    }

    render() {
        const {
            id,
            label,
            items
        } = this.props;

        const selectProps = {
            className: 'form-select',
            value: this.state.value,
            onChange: this.onChangeOfSelection
        }

        return (
            <div className="form-item form-type-select">
                <label htmlFor={id} className="form-label">
                    {label}
                    <span className="form-select-overlay">
                        <select
                            id={id}
                            {...selectProps}>
                            {
                                items.map((option, index) => (
                                    <option key={index} value={option.value}> {option.label} </option>
                                ))
                            }
                        </select>
                    </span>
                </label>
            </div>
        )
    }
}

Dropdown.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string, // This is optional
    items: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string
}

export default Dropdown
