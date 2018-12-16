const utils = require('../../src/common/utils')

test('camelCase should format snake_case as camelCase', () => {
    expect(utils.camelCase('camel_case')).toBe('camelCase')
})

test('mapDefaultsToFinanceSchema should remove variables that are not part of schema', () => {
    expect(utils.mapDefaultsToFinanceSchema('loan', {
        financeType: 'loan',
        interestRate: 2.29,
        downPayment: 5000,
        doNotInclude: 1234
    })).toEqual(expect.objectContaining({
        interestRate: 2.29,
        downPayment: 5000
    }))
})
