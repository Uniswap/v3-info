import 'inter-ui'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import './i18n'
import App from './pages/App'
import store from './state'
import UserUpdater from './state/user/updater'
import ProtocolUpdater from './state/protocol/updater'
import TokenUpdater from './state/tokens/updater'
import PoolUpdater from './state/pools/updater'
import { OriginApplication, initializeAnalytics } from '@uniswap/analytics'
import ApplicationUpdater from './state/application/updater'
import ListUpdater from './state/lists/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { ApolloProvider } from '@apollo/client/react'
import { client } from 'apollo/client'
import { SharedEventName } from '@uniswap/analytics-events'

// Actual key is set by proxy server
const AMPLITUDE_DUMMY_KEY = '00000000000000000000000000000000'
initializeAnalytics(AMPLITUDE_DUMMY_KEY, OriginApplication.INFO, {
  proxyUrl: process.env.REACT_APP_AMPLITUDE_PROXY_URL,
  defaultEventName: SharedEventName.PAGE_VIEWED,
  debug: true,
})

function Updaters() {
  return (
    <>
      <ListUpdater />
      <UserUpdater />
      <ProtocolUpdater />
      <TokenUpdater />
      <PoolUpdater />
      <ApplicationUpdater />
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <StrictMode>
    <FixedGlobalStyle />
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Updaters />
        <ThemeProvider>
          <ThemedGlobalStyle />
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </StrictMode>,
)
