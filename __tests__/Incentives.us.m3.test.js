const { LOAN, APP_NAME } = require('../src/common/dictionary')
const Incentives = require('../src/common/IncentivesUtil')
const US_M3 = require('../dev/data/mock_incentives_service_response_us_m3.json')

const mockIncentivesServiceData = {
    US: {
        m3: US_M3
    }
}

test('getFuelCalcParams should return proper values to pass to calcFuelSavings', () => {
    const fuelParams = Incentives.getFuelCalcParams({
        [`${APP_NAME}/Values`]: {
            fuelSavings: {
                fuelEfficiency: 31,
                distanceDriven: 68,
                fuelCost: 8,
                gasolineCost: 528,
                electricityCost: 22.44,
                estMonthlyGasSavingsPrice: 506
            }
        },
        [`${APP_NAME}/Incentive`]: {
            incentiveServiceData: mockIncentivesServiceData.US.m3
        }
    })

    expect(fuelParams).toEqual(expect.objectContaining({
        fuelPrice: 8,
        fuelEfficiency: 31,
        yearlyDistanceDriven: 24820,
        kwhConsumption: 0.237,
        kwhPrice: 0.127,
        months: 60,
        tollSavings: 0
    }))
})

test('calcFuelSavings should return expected values for market=US, model=model3, distance=10000 over 5 years', () => {
    const yearlyDistanceDriven = 10000

    const fuelEfficiency = 1 / 28 // convert imperial MPG to fraction before passing to calculator
    const fuelPrice = 2.85
    const fuelConstants = mockIncentivesServiceData.US.m3.find(o => o.incentiveType === 'fuel').variables

    const fuelSavings = Incentives.calcFuelSavings({
        months: fuelConstants.months,
        kwhPrice: fuelConstants.kwh_price,
        kwhConsumption: fuelConstants.kwh_consumption,
        tollSavings: fuelConstants.toll_savings,
        fuelEfficiency,
        yearlyDistanceDriven,
        fuelPrice
    })

    expect(fuelSavings).toEqual(expect.objectContaining({
        monthlyFuelSavings: 60,
        monthlyKWhCost: 25,
        totalFuelSavings: 3584,
        totalKWhCost: 1505
    }))
})

test('getComponentRegionalIncentives should return all applicable regional incentives', () => {
    const result = Incentives.getComponentRegionalIncentives({
        [`${APP_NAME}/Values`]: {
            financeType: LOAN
        }
    }, mockIncentivesServiceData.US.m3);

    const expected = [
        { value: 'CA', label: 'California' },
        { value: 'CO', label: 'Colorado' },
        { value: 'DE', label: 'Delaware' },
        { value: 'LA', label: 'Louisiana' },
        { value: 'MA', label: 'Massachusetts' },
        { value: 'NY', label: 'New York' },
        { value: 'other', label: 'Other State' }
    ]
    expect(result).toMatchObject(expected)
})


test('getTaxIncentives should return `other` state incentive', () => {
    const regionCode = 'other';
    const result = Incentives.getTaxIncentives({
        [`${APP_NAME}/Values`]: {
            financeType: LOAN
        },
        [`${APP_NAME}/Location`]: {
            regionCode
        }
    }, mockIncentivesServiceData.US.m3)

    expect(Object.keys(result)).toEqual(expect.arrayContaining(['incentives', 'total']))

    const expected = [
        { amount: 7500, incentiveType: 'federal', rule: 'apply_once' },
        {
            incentiveType: 'regional',
            regionCode,
            amount: 0
        }]
    expect(result.incentives).toMatchObject(expected)
})

test('getTaxIncentives should return `CA` state incentive', () => {
    const regionCode = 'CA';
    const result = Incentives.getTaxIncentives({
        [`${APP_NAME}/Values`]: {
            financeType: LOAN
        },
        [`${APP_NAME}/Location`]: {
            regionCode
        }
    }, mockIncentivesServiceData.US.m3);

    expect(Object.keys(result)).toEqual(expect.arrayContaining(['incentives', 'total']))

    const expected = [
        { amount: 7500, incentiveType: 'federal', rule: 'apply_once' },
        {
            incentiveType: 'regional',
            regionCode,
            amount: 2500
        }]
    expect(result.incentives).toMatchObject(expected)
})

test('getTaxIncentives should return `LA` state incentive with proper option override amount', () => {
    const regionCode = 'LA'
    const result = Incentives.getTaxIncentives({
        [`${APP_NAME}/Values`]: {
            financeType: LOAN
        },
        [`${APP_NAME}/Location`]: {
            regionCode
        },
        [`${APP_NAME}/Configuration`]: {
            options: ['PBT85']
        }
    }, mockIncentivesServiceData.US.m3);

    expect(Object.keys(result)).toEqual(expect.arrayContaining(['incentives', 'total']))

    const expected = [
        { amount: 7500, incentiveType: 'federal', rule: 'apply_once' },
        {
            incentiveType: 'regional',
            regionCode,
            amount: 9500
        }]

    expect(result.incentives).toMatchObject(expected)
    expect(result.total).toMatchObject({
        apply_once: 17000
    })
})

