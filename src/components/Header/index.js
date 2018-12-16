import React from 'react'
import PropTypes from 'prop-types'

const Header = props => (
    <header className="tsla-side-panel--header">
        <button className="btn-close tsla-side-panel--left_placeholder"
            onClick={() => props.onViewChange(props.onBackView)}>&#8249;</button>
        <div className="tsla-side-panel--title">
            {props.title}
        </div>
    </header>
)

Header.propTypes = {
    onViewChange: PropTypes.func,
    onBackView: PropTypes.string,
    title: PropTypes.string
}

export default Header
