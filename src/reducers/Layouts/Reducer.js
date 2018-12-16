
import { _ } from 'third_party'
import {
    DOWNPAYMENT,
    TRADEIN,
    INTEREST_RATE,
    DISTANCE,
    TERM_IN_MONTHS,
    VIEW_CHANGE,
    FUEL_EFFICIENCY,
    DISTANCE_DRIVEN,
    FUEL_COST,
    TAX_INCENTIVES,
    TAX_INCENTIVE_CHANGE,
    INCENTIVE_DATA_LOADED,
    INITIAL_DATA_LOADED,
    INCENTIVES_SUMMARY,
    INCENTIVES_SUMMARY_CHANGE
} from 'dictionary'

import initialState from './InitialState'

const componentSpecs = {
    Selector: {
        // required to add to layout
        requiredProps: ['items', 'defaultValue']
    },
    Slider: {
        requiredProps: []
    },
    TaxIncentives: {
        requiredProps: ['incentives']
    },
    IncentivesSummary: {
        requiredProps: []
    },
    TradeInButton: {
        requiredProps: []
    }
}

// maps term type to comoponent tyoe
const componentTypeMap = {
    [DOWNPAYMENT]: {
        component: 'Slider'
    },
    [INTEREST_RATE]: {
        component: 'Selector'
    },
    [TERM_IN_MONTHS]: {
        component: 'Selector'
    },
    [DISTANCE]: {
        component: 'Selector'
    },
    [FUEL_EFFICIENCY]: {
        component: 'Slider'
    },
    [DISTANCE_DRIVEN]: {
        component: 'Slider'
    },
    [FUEL_COST]: {
        component: 'Slider'
    },
    [TAX_INCENTIVES]: {
        component: 'TaxIncentives'
    },
    [INCENTIVES_SUMMARY]: {
        component: 'IncentivesSummary'
    },
    [TRADEIN]: {
        component: 'TradeInButton'
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case INITIAL_DATA_LOADED:
            return Object.assign({}, state, {
                [action.context]: Object.assign({}, state[action.context], {
                    layouts: {
                        calculator: mergeLayouts(state[action.context], 'calculator', action.layoutProps.financeTypes)
                    }
                })
            })
        case INCENTIVE_DATA_LOADED:
            return Object.assign({}, state, {
                [action.context]: Object.assign({}, state[action.context], {
                    layouts: {
                        calculator: state[action.context].layouts.calculator,
                        incentive: mergeLayouts(state[action.context], 'incentives', action.layoutProps.type)
                    }

                })
            })

        case TAX_INCENTIVE_CHANGE:
            return Object.assign({}, state, {
                [action.context]: Object.assign({}, state[action.context], {
                    layouts: Object.assign({}, state[action.context].layouts, {
                        incentive: mergeLayouts(state[action.context], 'incentives', action.layoutProps.type)
                    })
                })
            })

        case INCENTIVES_SUMMARY_CHANGE:
            return Object.assign({}, state, {
                [action.context]: Object.assign({}, state[action.context], {
                    layouts: Object.assign({}, state[action.context].layouts, {
                        incentive: Object.assign({}, state[action.context].layouts.incentive, {
                            incentivesSummary: Object.assign({}, state[action.context].layouts.incentive.incentivesSummary, {
                                components : state[action.context].layouts.incentive.incentivesSummary.components.map((component) => {
                                    component.props = {
                                        ...component.props,
                                        options: action.options
                                    }
                                    return component
                                })

                            })
                        })
                    })
                })
            })

        case VIEW_CHANGE:
            return Object.assign({}, state, {
                currentView: action.viewName
            })
        default:
            return state
    }
}

function mergeLayouts(state, context, layoutProps) {
    const layouts = _.reduce(layoutProps, (r, financeData, financeType) => {
        if (_.isEmpty(financeData)) {
            return r
        }

        r[financeType] = Object.assign({}, state[financeType], {
            components: financeData.components.reduce((acc, c) => {
                const componentType = componentTypeMap[c.id].component
                // filter out items with empty objects or arrays
                const props = Object.keys(c.props).reduce((r1, p) => {
                    if (typeof c.props[p] === 'object' ? (_.isObject(c.props[p]) && !_.isEmpty(c.props[p])) : !_.isNil(c.props[p])) {
                        r1[p] = c.props[p]
                    }
                    return r1
                }, {})

                if (!_.difference(componentSpecs[componentType].requiredProps, Object.keys(props)).length) {
                    acc.push(Object.assign({}, c, {
                        component: componentType,
                        props
                    }))
                }
                return acc
            }, [])
        })
        return r
    }, {})

    return Object.assign({}, state.layouts[context], layouts)
}
