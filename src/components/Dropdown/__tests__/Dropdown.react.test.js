
import React from 'react'
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dropdown from '../index'

configure({ adapter: new Adapter() });

const items = [
    { label: 'California', value: 'CA' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Delaware', value: 'DE' }
]

const id = 'testDropDown'

test('Check component is loaded', () => {
    const onChangeMock = jest.fn()
    const component = shallow(<Dropdown items={items} onChange={onChangeMock} id={id}/>);
    expect(component.length).toBe(1)
});

test('Checks the selected value is being set in the state on default', () => {
    const onChangeMock = jest.fn()
    const component = shallow(<Dropdown id={id} onChange={onChangeMock} items={items} selectedValue='CA'/>);
    expect(component.state('value')).toEqual('CA')
});

test('Checks the Dropdown sets value in state after onChange', () => {
    const onChangeMock = jest.fn()
    const component = shallow(<Dropdown id="testDropdown" onChange={onChangeMock} items={items} selectedValue='CA'/>);

    const event = { target: { value: 'LA' } }
    component.find('select').simulate('change', event)
    expect(component.state('value')).toEqual('LA')
});
