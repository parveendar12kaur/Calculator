/* eslint import/no-extraneous-dependencies: off */

import React from 'react'
import _get from 'lodash/get'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { reducerRegistry } from 'globals'
import { getVersion } from 'utils'

import {
    APP_NAME,
    DEFAULT_MARKET,
    DEFAULT_LANGUAGE,
    DEFAULT_MODEL,
    DEFAULT_APP_CONTEXT
} from 'dictionary'

import pkg from '../package.json'
import Main from './containers/Main'
import reducers from './reducers'
import epics from './epics'
import rehydrateState from './reducers/rehydrateState'


// import styles
import './styles/index.scss'

// for example only, these params could be coming from a cookie, or as url param, etc
const params = {
    context: _get(window, 'tesla.calculator_context', DEFAULT_APP_CONTEXT),
    market: _get(window, 'tesla.market', DEFAULT_MARKET),
    language: _get(window, 'tesla.language', DEFAULT_LANGUAGE),
    model: _get(window, 'tesla.model', DEFAULT_MODEL),
    version: _get(window, 'tesla.version', getVersion(pkg.version))
}

// here is where you might can override some parts of your state
// with json injected into the page from the server
const injections = {
    App: {
        context: params.context,
        version: params.version,
        market: params.market,
        language: params.language,
        env: _get(window, 'tesla.env')
    }
}

const config = {
    id: APP_NAME,
    initialState: rehydrateState(params, injections),
    reducers,
    epics
}

reducerRegistry.register(config, () => {
    const store = reducerRegistry.getStore()
    render(
        <Provider store={store}>
            <Main />
        </Provider>,
        document.getElementById('tsla-fin-calculator')
    )
})
