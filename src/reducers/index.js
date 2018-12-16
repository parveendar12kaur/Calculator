import { APP_NAME } from 'dictionary'

// export Reducers
import * as App from './App'
import * as Values from './Values'
import * as Terms from './Terms'
import * as Layouts from './Layouts'
import * as Locale from './Locale'
import * as Incentive from './Incentive'
import * as Location from './Location'
import * as Fees from './Fees'
import FinanceSummary from '../components/FinanceSummary/Reducer'

export * from './App/Actions'
export * from './Terms/Actions'
export * from './Values/Actions'
export * from './Layouts/Actions'
export * from './Incentive/Actions'
export * from './Location/Actions'
export * from './Fees/Actions'
export * from '../components/FinanceSummary/Actions'

export default {
    [`${APP_NAME}/App`]: App.Reducer,
    [`${APP_NAME}/Values`]: Values.Reducer,
    [`${APP_NAME}/Terms`]: Terms.Reducer,
    [`${APP_NAME}/Layouts`]: Layouts.Reducer,
    [`${APP_NAME}/Incentive`]: Incentive.Reducer,
    [`${APP_NAME}/Location`]: Location.Reducer,
    [`${APP_NAME}/Fees`]: Fees.Reducer,
    [`${APP_NAME}/FinanceSummary`]: FinanceSummary,
    Locale: Locale.Reducer
}
