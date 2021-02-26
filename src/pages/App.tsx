import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import Header from "../components/Header";
import Home from "./Home";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";

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
            <Route exact strict path="/swap" component={Home} />
          </Switch>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
