import React from 'react'
import PropTypes from 'prop-types'
import { CALCULATOR } from 'dictionary'
import Sidebar from '../components/Sidebar'

const Main = ({
    CurrentViewComponent, selectedFinanceLabel, formattedPrice, currentView, contextViewConditions, otherProps
}) => (

    <div className="tsla-calc-main--container">
        <If condition={contextViewConditions.enableMainHeader}>
            <div className="fixed-header-bar">
                <a className="tsla-link--secondary"> {selectedFinanceLabel} </a> -
                <span className="tsla-text--medium-bold">{formattedPrice}</span>
                <span className="tsla-links--no_underline">
                    <a className="tsla-calc-edit" href="#" onClick={e => otherProps.toggleModal(e)}>Edit</a>
                </span>
                <span className="tsla-vertical-br-line"> </span>
                <span className="tsla-links--no_underline">
                    <span className="tsla-calc-dollar-icon">&#36;</span>
                    <a className="tsla-link--secondary tsla-text--medium-bold" href="#"
                        onClick={otherProps.getIncentivesView}>Calculate savings
                    </a>
                </span>
            </div>
        </If>
        <Choose>
            <When condition={contextViewConditions.enableSidebar}>
                <Sidebar
                    isOpen={otherProps.isOpen}
                    toggleModal = {otherProps.toggleModal}
                    showMainScreenIcons = {currentView === CALCULATOR}>
                    <CurrentViewComponent />
                </Sidebar>
            </When>
            <Otherwise>
                <CurrentViewComponent />
            </Otherwise>
        </Choose>
    </div>
)

Main.propTypes = {
    CurrentViewComponent: PropTypes.object,
    selectedFinanceLabel: PropTypes.string,
    formattedPrice: PropTypes.number,
    currentView: PropTypes.string,
    contextViewConditions: PropTypes.object,
    otherProps: PropTypes.object
}

export default Main

