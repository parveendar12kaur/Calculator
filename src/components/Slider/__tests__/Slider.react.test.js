// Slider.react.test.js

import React from 'react'
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Slider from '../index'

configure({ adapter: new Adapter() });

test('Slider sets value in state after onChange', () => {
    const onChangeMock = jest.fn()
    const component = shallow(<Slider onChange={onChangeMock} min={1000} max={5000}/>);

    const event = { target: { value: 3000 } }
    component.find('input').simulate('change', event)
    expect(component.state('value')).toEqual(3000)
});


test('Slider calls props.onChange after on mouseUp', () => {
    const onChangeMock = jest.fn()
    const component = shallow(<Slider id='interestRate' onChange={onChangeMock} min={1000} max={5000}/>);

    const event = { target: { value: 3000 } }
    component.find('input').simulate('mouseup', event)
    expect(onChangeMock).toHaveBeenCalledWith('interestRate', 3000)
});
