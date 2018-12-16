import _get from 'lodash/get'

export const reducerRegistry = _get(window, 'tesla.reducerRegistry', {
    register: () => {
        console.error('registry module not loaded');
    }
})

export const calcJS = _get(window, 'Tesla.CalculatorJS');
