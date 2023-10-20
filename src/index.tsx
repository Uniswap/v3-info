import 'inter-ui'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga'
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

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'ethereum' in window
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  })
})

// Actual key is set by proxy server
const AMPLITUDE_DUMMY_KEY = '00000000000000000000000000000000'
initializeAnalytics(
  AMPLITUDE_DUMMY_KEY,
  OriginApplication.INTERFACE, // OriginApplication.INFO, // todo: use correct value here
  {
    proxyUrl: process.env.REACT_APP_AMPLITUDE_PROXY_URL,
    defaultEventName: SharedEventName.PAGE_VIEWED,
  },
)

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
