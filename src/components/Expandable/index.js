import React from 'react'
import PropTypes from 'prop-types'

const Expandable = props => (<div className='tsla-expandable'>
    <a onClick={props.onClick} className='--tsla-hyperlink-color'>{props.label}</a>
    <div className={`tsla-expandable--content ${props.expanded ? 'expanded' : ''}`}>
        {props.children}
    </div>
</div>)

Expandable.propTypes = {
    children: PropTypes.element,
    label: PropTypes.string,
    expanded: PropTypes.bool,
    onClick: PropTypes.func
}

export default Expandable
