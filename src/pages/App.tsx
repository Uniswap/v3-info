import React, { Suspense, useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Home from './Home'
import Protocol from './Protocol'
import PoolsOverview from './Pool/PoolsOverview'
import TokensOverview from './Token/TokensOverview'
import TopBar from 'components/Header/TopBar'
import { RedirectInvalidToken } from './Token/redirects'
import { LocalLoader } from 'components/Loader'
import PoolPage from './Pool/PoolPage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
  position: fixed;
  justify-content: space-between;
  z-index: 2;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 40px;
  margin-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;

  > * {
    max-width: 1200px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000)
  }, [])

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      {loading ? (
        <LocalLoader fill={true} />
      ) : (
        <AppWrapper>
          <URLWarning />
          <HeaderWrapper>
            <TopBar />
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Popups />
            <Switch>
              <Route exact strict path="/" component={Home} />
              <Route exact strict path="/protocol" component={Protocol} />
              <Route exact strict path="/pools" component={PoolsOverview} />
              <Route exact strict path="/tokens" component={TokensOverview} />
              <Route exact strict path="/tokens/:address" component={RedirectInvalidToken} />
              <Route exact strict path="/pools/:address" component={PoolPage} />
            </Switch>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      )}
    </Suspense>
  )
}
