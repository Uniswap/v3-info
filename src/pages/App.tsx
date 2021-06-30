import React, { Suspense, useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Home from './Home'
import PoolsOverview from './Pool/PoolsOverview'
import TokensOverview from './Token/TokensOverview'
import TopBar from 'components/Header/TopBar'
import { RedirectInvalidToken } from './Token/redirects'
import { LocalLoader } from 'components/Loader'
import PoolPage from './Pool/PoolPage'
import { ExternalLink, HideMedium, TYPE } from 'theme'
import { useActiveNetworkVersion, useSubgraphStatus } from 'state/application/hooks'
import { DarkGreyCard } from 'components/Card'
import { ArbitrumNetworkInfo, EthereumNetworkInfo } from 'constants/networks'

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
    padding-top: 2rem;
    margin-top: 100px;
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
  // pretend load buffer
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1300)
  }, [])

  // subgraph health
  const [subgraphStatus] = useSubgraphStatus()

  // update network based on route
  // TEMP - find better way to do this
  const location = useLocation()
  const [, setActiveNetwork] = useActiveNetworkVersion()
  useEffect(() => {
    if (location.pathname.includes('arbitrum')) {
      setActiveNetwork(ArbitrumNetworkInfo)
    } else {
      setActiveNetwork(EthereumNetworkInfo)
    }
  }, [location.pathname, setActiveNetwork])

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      {loading ? (
        <LocalLoader fill={true} />
      ) : subgraphStatus.available === false ? (
        <AppWrapper>
          <BodyWrapper>
            <DarkGreyCard style={{ maxWidth: '340px' }}>
              <TYPE.label>
                The Graph network which provides data for this site is temporarily down. Check status{' '}
                <ExternalLink href="https://thegraph.com/explorer/subgraph/ianlapham/uniswap-v3-testing">
                  here.
                </ExternalLink>
              </TYPE.label>
            </DarkGreyCard>
          </BodyWrapper>
        </AppWrapper>
      ) : (
        <AppWrapper>
          <URLWarning />
          <HeaderWrapper>
            <HideMedium>
              <TopBar />
            </HideMedium>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Popups />
            <Switch>
              <Route exact strict path="/:networkID?/" component={Home} />
              <Route exact strict path="/:networkID?/pools" component={PoolsOverview} />
              <Route exact strict path="/:networkID?/tokens" component={TokensOverview} />
              <Route exact strict path="/:networkID?/tokens/:address" component={RedirectInvalidToken} />
              <Route exact strict path="/:networkID?/pools/:address" component={PoolPage} />
            </Switch>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      )}
    </Suspense>
  )
}
