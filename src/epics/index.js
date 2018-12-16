import { priceChangeEpic } from '../reducers/Values/Actions'
import { persistStateEpic } from '../reducers/App/Actions'
import { incentiveChangeEpic } from '../reducers/Incentive/Actions'
import { feesChangeEpic } from '../reducers/Fees/Actions'

export default [
    persistStateEpic,
    priceChangeEpic,
    incentiveChangeEpic,
    feesChangeEpic
]
