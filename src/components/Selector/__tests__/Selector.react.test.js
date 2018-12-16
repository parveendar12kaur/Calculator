// Selector.react.test.js

import React from 'react'
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Selector from '../index'

configure({ adapter: new Adapter() });

const items = [
    {
        label: '48 months',
        value: 48
    },
    {
        label: '60 months',
        value: 60
    },
    {
        label: '72 months',
        value: 72
    }
]

describe('Selector Component Test Suite', () => {
    let props
    let component

    beforeEach(() => {
        props = {
            onChange: jest.fn(() => 'onChangeMock'),
            items,
            label: 'Terms',
            selectedValue: 72,
            id: 'termInMonths',
            term: 'termInMonths'
        };
        component = shallow(<Selector {...props} />);
    });

    test('Slector component renders without crashing', () => {
        expect(component).toBeDefined();
    });

    test('renders div with unique id', () => {
        expect(component.find('div#termInMonths')).toHaveLength(1);
    });

    test('render label for Selector Component', () => {
        const headingLabel = component.find('label').first();
        expect(headingLabel.props('children').children).toEqual(props.label)
    });

    test('render label for each item', () => {
        const itemGroup = component.find('div.tsla-switch_group');
        expect(itemGroup.find('label').length).toEqual(props.items.length)
    });

    test('render checked input based on selected value', () => {
        const input = component.find('input[checked=true]');
        expect(input.props().value).toEqual(props.selectedValue);
    })

    test('render toggle switch class', () => {
        const selectedIndex = props.items.findIndex(item => item.value === props.selectedValue)
        const offsetWidth = 100 / items.length
        const selectorClass = component.find('div.tsla-switch_group--slider')
        expect(selectorClass.props().style['--tsla-switch_group-slider-position']).toEqual(`${offsetWidth * selectedIndex}%`)
        expect(selectorClass.props().style['--tsla-switch_group-slider-label-width']).toEqual(`${offsetWidth}%`)
    })

    test('render label style', () => {
        const offsetWidth = 100 / props.items.length
        const itemLabels = component.find('div.tsla-switch_group label')
        itemLabels.map(label => expect(label.props().style['--tsla-switch_group-slider-label-width']).toEqual(`${offsetWidth}%`))
    })

    test('Selector calls props.onChange on change of input', () => {
        const event = { target: { value: 48 } };
        component.find('input[value=48]').simulate('change', event);
        expect(props.onChange).toHaveBeenCalledWith(props.term, 48);
    });
})
