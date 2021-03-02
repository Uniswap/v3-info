import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import Header from "../components/Header";
import Home from "./Home";
import Protocol from "./Protocol";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";
import TokensOverview from "./Token/TokensOverview";
import PoolssOverview from "./Pool/PoolsOverview";
import Wallets from "./Wallets";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
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
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Switch>
            <Route exact strict path="/" component={Home} />
            <Route exact strict path="/protocol" component={Protocol} />
            <Route exact strict path="/tokens" component={TokensOverview} />
            <Route exact strict path="/pools" component={PoolssOverview} />
            <Route exact strict path="/wallets" component={Wallets} />
          </Switch>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
