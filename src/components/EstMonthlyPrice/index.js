import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toFloat } from '@web/tesla-lang'
import { validateMonthlyInputValue, getMonthlyPaymentErrorText } from 'utils'

class EstMonthlyPrice extends Component {
    constructor(props) {
        super(props)
        this.onEditMonthlyPrice = this.onEditMonthlyPrice.bind(this)
        this.updateMonthlyPrice = this.updateMonthlyPrice.bind(this)
        this.onChangeInValue = this.onChangeInValue.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.state = {
            inputType: 'text',
            isEditable: false,
            value: this.props.formattedPrice,
            inputError: false
        };
    }


    onEditMonthlyPrice() {
        const currentValue = this.state.value
        const value = toFloat(currentValue, '')
        const inputType = 'number'
        const isEditable = true

        this.setState({
            inputType,
            isEditable,
            value
        })
    }

    updateMonthlyPrice(e) {
        const value = parseFloat(e.target.value)

        // Check the user input value is valid
        // if valid then trigger onchange else make the input field as editable and throw an input error
        if (validateMonthlyInputValue(value)) {
            this.props.onChange(value)
        } else {
            this.setState({
                isEditable: true,
                inputType: 'number',
                inputError: true
            })
        }
    }


    componentDidUpdate(nextProps, nextState) {
        if (!nextState.isEditable) {
            this.estMonthlyInput.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        // on receiving props set value to updated price and set all the other attributes to default
        this.setState({
            isEditable: false,
            inputType: 'text',
            inputError: false,
            value: nextProps.formattedPrice
        })
    }

    onChangeInValue(e) {
        this.setState({ value: e.target.value })
    }

    handleKeyPress(e) {
        if (e.keyCode === 13 && e.target) {
            e.target.blur();
        }
    }

    render() {
        const { displayAccess } = this.props
        const { value, inputError } = this.state

        const editableClass = this.state.isEditable ?
            'tsla-calc-monthly-price--value tsla-calc-editable-field' : 'tsla-calc-monthly-price--value'

        return (
            <div className='tsla-calc-monthly-price'>
                <input id="calcPrice"
                    type={this.state.inputType}
                    ref={(input) => { this.estMonthlyInput = input }}
                    value={value}
                    className={editableClass}
                    onChange={e => this.onChangeInValue(e)}
                    disabled={!this.state.isEditable}
                    onKeyUp={e => this.handleKeyPress(e)}
                    onBlur={e => this.updateMonthlyPrice(e)}/>
                {
                    displayAccess ?
                        <button className="tsla-calc-monthly-price--edit-icon" onClick={() => this.onEditMonthlyPrice()}> &#9998;</button>
                        : null
                }
                {
                    inputError ? <div id="estMonthlyError" className="tsla-error"> {getMonthlyPaymentErrorText(value)} </div> : null

                }
            </div>
        )
    }
}

EstMonthlyPrice.propTypes = {
    formattedPrice: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    displayAccess: PropTypes.bool
}


export default EstMonthlyPrice
