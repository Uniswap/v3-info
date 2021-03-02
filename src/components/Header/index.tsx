import React from "react";
import { NavLink } from "react-router-dom";
import { darken } from "polished";

import styled from "styled-components";
import Logo from "../../assets/images/logo.svg";
import LogoDark from "../../assets/images/logo_white.svg";
import { useDarkModeManager } from "../../state/user/hooks";
import Row, { RowFixed } from "../Row";
import Web3Status from "../Web3Status";

const activeClassName = "ACTIVE";

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;

  background-color: ${({ theme }) => theme.bg0};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`;

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`;

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`;

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 24px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`;

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 1rem;
  width: fit-content;
  margin: 0 6px;
  font-weight: 600;
  padding: 8.5px 12px;

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

export default function Header() {
  // const [isDark] = useDarkModeManager()
  const [darkMode] = useDarkModeManager();

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to={"/"}>
          <UniIcon>
            <img width={"20px"} src={darkMode ? LogoDark : Logo} alt="logo" />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink
            id={`swap-nav-link`}
            to={"/"}
            isActive={(match, { pathname }) => pathname === "/"}
          >
            Overview
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={"/protocol"}>
            Protocol
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={"/pools"}>
            Pools
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={"/tokens"}>
            Tokens
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={"/wallets"}>
            Wallets
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <Web3Status />
    </HeaderFrame>
  );
}
