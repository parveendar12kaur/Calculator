// EstMonthlyPrice.react.test.js

import React from 'react'
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EstMonthlyPrice from '../index'
configure({ adapter: new Adapter() });

describe('EstMonthlyPrice Component Test Suite', () => {
    let props
    let component

    beforeEach(() => {
        props = {
            onChange: jest.fn(() => 'onChangeMock'),
            formattedPrice : '$1548 /mo',
            displayAccess : true
        };
        component = shallow(<EstMonthlyPrice {...props} />);
    });

    test('EstMonthlyPrice component renders without crashing', () => {
        expect(component).toBeDefined();
    });

    test('EstMonthlyPrice component should load initial state', () => {
        expect(component.state()).toEqual( { inputType: 'text',
        isEditable: false,
        value: props.formattedPrice,
        inputError: false });
    });

    test('render Edit button for EstMonthlyPrice Component with proper class', () => {
        const editButton = component.find('button').first();
        expect(editButton.props().className).toEqual('tsla-calc-monthly-price--edit-icon')
    });

    test('Edit button click will update state in EstMonthlyPrice component', () => {
        const onClickMock = jest.fn()
        const editButton = component.find('button').first()
        editButton.simulate('click')
        expect(component.state()).toEqual({ inputType: 'number',
            isEditable: true,
            value: 1548,
            inputError: false })
        
    });

    test('Input should convert to number on edit button click', () => {
        const onClickMock = jest.fn()
        const editButton = component.find('button').first()
        editButton.simulate('click')
        const inputElement = component.find('input')
        expect(inputElement.props().type).toEqual('number')
    });

    test('Input should have proper class on edit button click', () => {
        const onClickMock = jest.fn()
        const editButton = component.find('button').first()
        editButton.simulate('click')
        const inputElement = component.find('input')
        expect(inputElement.props().className).toEqual('tsla-calc-monthly-price--value tsla-calc-editable-field')
    });

    test('Input should be enabled on edit button click', () => {
        const onClickMock = jest.fn()
        const editButton = component.find('button').first()
        editButton.simulate('click')
        const inputElement = component.find('input')
        expect(inputElement.props().disabled).toEqual(false)
    });

    test('update state on input change', () => {
        const onChangeMock = jest.fn()
        const inputElement = component.find('input')
        const event = { target: { value: 2000 } }
        inputElement.simulate('change', event)
        expect(component.state('value')).toEqual(2000)
    });

    test('validate value on Estimated Monthly Input blur', () => {
        const onBlurMock = jest.fn()
        const inputElement = component.find('input')
        const event = { target: { value: 2000 } }
        inputElement.simulate('blur', event)
        expect(component.state('inputError')).toEqual(true)
    });

    test('Do not update state on false validation of Estimated Monthly Input blur', () => {
        const onBlurMock = jest.fn()
        const inputElement = component.find('input')
        const event = { target: { value: 2000 } }
        inputElement.simulate('blur', event)
        expect(component.state('value')).toEqual('$1548 /mo')
    });

    test('validate value on Estimated Monthly Input blur', () => {
        const onBlurMock = jest.fn()
        const inputElement = component.find('input')
        const event = { target: { value: 2000 } }
        inputElement.simulate('blur', event)
        const errorDiv = component.find('#estMonthlyError')
        expect(errorDiv.props().className).toEqual('tsla-error') // Need to check error message too but not getting it
    });

    test('EstMonthlyPrice calls props.onChange on blur of input after true validation', () => {
        const inputElement = component.find('input')
        const event = { target: { value: 1400 } }
        inputElement.simulate('blur', event)
        expect(props.onChange).toHaveBeenCalledWith(parseFloat(event.target.value));
    });

    test('Component will receive props test', () => {
        const wrapper = mount(<EstMonthlyPrice formattedPrice='$1325 /mo' />)
        wrapper.setProps({formattedPrice: '$1478 /mo'});
        expect(wrapper.state()).toEqual({ inputType: 'text',
            isEditable: false,
            value: '$1478 /mo',
            inputError: false })
    });

    test('ComponentDidUpdate props test', () => {
        const wrapper = mount(<EstMonthlyPrice formattedPrice='$1325 /mo' />)
        const inputElement = wrapper.instance().estMonthlyInput
        spyOn(inputElement, 'focus');
        wrapper.setProps({formattedPrice: '$1478 /mo', isEditable: true});
        expect(inputElement.focus).toHaveBeenCalled()
    });
})
