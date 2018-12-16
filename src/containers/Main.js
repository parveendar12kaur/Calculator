import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initApp, viewChange } from 'actions'
import { APP_NAME, INCENTIVE, CALCULATOR, TRADEIN } from 'dictionary'
import _get from 'lodash/get'
import { i18n, getEstFinalAmount } from 'utils'
import Calculator from '../components/Calculator'
import Incentives from '../components/Incentives'
import TradeIn from '../components/TradeIn'
import template from './template'

const componentMap = {
    Calculator,
    Incentives,
    TradeIn
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.getSelectedComponentView = this.getSelectedComponentView.bind(this)
        this.getIncentivesView = this.getIncentivesView.bind(this)
        this.state = {
            isOpen: false
        };
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(initApp())
    }

    toggleModal(e) {
        e.preventDefault();
        if (this.props.currentView !== CALCULATOR) {
            this.props.dispatch(viewChange(CALCULATOR))
        } else {
            this.setState({
                isOpen: !this.state.isOpen
            })
        }
    }

    getIncentivesView() {
        this.props.dispatch(viewChange(INCENTIVE))
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    getSelectedComponentView() {
        const { currentView } = this.props
        switch (currentView) {
            case CALCULATOR:
            default:
                return componentMap[CALCULATOR]
            case INCENTIVE:
                return componentMap[INCENTIVE]
            case TRADEIN:
                return componentMap[TRADEIN]
        }
    }

    render() {
        const CurrentViewComponent = this.getSelectedComponentView()

        const {
            selectedFinanceLabel,
            formattedPrice,
            currentView,
            contextViewConditions
        } = this.props

        const otherProps = {
            isOpen: this.state.isOpen,
            getIncentivesView: this.getIncentivesView,
            toggleModal: this.toggleModal
        }

        return template({
            CurrentViewComponent, selectedFinanceLabel, formattedPrice, currentView, contextViewConditions, otherProps
        })
    }
}

function mapStateToProps(state) {
    const Values = _get(state, `${APP_NAME}/Values`)
    const selectedFinanceLabel = i18n(`labels.${`${Values.financeType}_label`}`)
    const context = _get(state, `${APP_NAME}/App.context`)

    // Layout stuff
    const Layouts = _get(state, `${APP_NAME}/Layouts`)
    const { currentView } = Layouts
    const enableMainHeader = (_get(Layouts, `${context}.contextViews.mainHeader`)) === undefined
    const enableSidebar = (_get(Layouts, `${context}.contextViews.sidebar`) === undefined)
    const contextViewConditions = { enableMainHeader, enableSidebar }

    const formattedPrice = getEstFinalAmount(state);

    return {
        selectedFinanceLabel,
        formattedPrice,
        currentView,
        contextViewConditions
    }
}


Main.propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedFinanceLabel: PropTypes.string.isRequired,
    formattedPrice: PropTypes.string.isRequired,
    currentView: PropTypes.string,
    contextViewConditions: PropTypes.object
}

export default connect(mapStateToProps)(Main)
