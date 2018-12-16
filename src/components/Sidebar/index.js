import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Sidebar extends Component {
    render() {
        const {
            isOpen,
            toggleModal,
            showMainScreenIcons,
            children
        } = this.props;

        const calcSidebarClass = isOpen ? 'tsla-side-panel tsla-side-panel--will_fadein' : 'tsla-side-panel hidden';

        return (
            <div className="side-panel-open">
                <div className={calcSidebarClass}>
                    {isOpen === true ?
                        <div className="tsla-side-panel--content">
                            {
                                showMainScreenIcons ?
                                    <header className="tsla-side-panel--action">
                                        <button className="btn-close tsla-side-panel--left_placeholder"
                                            onClick={toggleModal}>&times;</button>
                                        <button className="btn-close tsla-side-panel--right_placeholder">
                                            &middot;&middot;&middot;</button>
                                    </header>
                                    : null
                            }
                            {children}
                        </div>
                        : null
                    }
                </div>
            </div>
        )
    }
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    children: PropTypes.node,
    showMainScreenIcons: PropTypes.bool.isRequired
}

export default Sidebar
