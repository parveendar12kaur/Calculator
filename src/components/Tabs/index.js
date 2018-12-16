import React from 'react'
import PropTypes from 'prop-types'

// Tabs component
const Tabs = ({
    tabs, onClick, selectedTab, children
}) => (
    <div className="tsla-fin-cal-side-panel-header">
        <header className="tsla-side-panel--header">
            <div className="tsla-tabs-row">
                <div className='tsla-tabs'>
                    <div className="tsla-tabs--labels">
                        {
                            tabs.map((tab, i) => (
                                <div key={`tab${i}`}>
                                    <input className="tsla-tabs-radio"
                                        id={tab.label} type="radio" name="tsla-tabs"
                                        onChange={() => {
                                            onClick(tab)
                                        }}
                                        checked={tab.id === selectedTab}/>
                                    <label className="tsla-tabs-label" htmlFor={tab.label}>{tab.label}</label>
                                </div>

                            ))
                        }
                    </div>
                </div>
            </div>
        </header>
        <div className="tsla-side-panel--body">
            <div className='tsla-tabs-drawer'>
                {children}
            </div>
        </div>
    </div>
)

Tabs.propTypes = {
    tabs: PropTypes.array,
    onClick: PropTypes.func.isRequired,
    selectedTab: PropTypes.string,
    children: PropTypes.array
}

export default Tabs

