import React from 'react'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import styled from 'styled-components'
import LogoDark from '../../assets/svg/logo_white.svg'
import Menu from '../Menu'
import Row, { RowFixed, RowBetween } from '../Row'
import SearchSmall from 'components/Search'
import NetworkDropdown from 'components/Menu/NetworkDropdown'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { AutoColumn } from 'components/Column'

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  background-color: ${({ theme }) => theme.bg0};

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  @media (max-width: 1080px) {
    width: 100%;
  }
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  @media (max-width: 1080px) {
    padding: 0.5rem;
    justify-content: flex-end;
  } ;
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

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
  padding: 8px 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const SmallContentGrouping = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`

export default function Header() {
  const [activeNewtork] = useActiveNetworkVersion()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to={networkPrefix(activeNewtork)}>
          <UniIcon>
            <img width={'24px'} src={LogoDark} alt="logo" />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink
            id={`pool-nav-link`}
            to={networkPrefix(activeNewtork)}
            isActive={(match, { pathname }) => pathname === '/'}
          >
            Overview
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'pools'}>
            Pools
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'tokens'}>
            Tokens
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <NetworkDropdown />
        <SearchSmall />
        <Menu />
      </HeaderControls>
      <SmallContentGrouping>
        <AutoColumn gap="sm">
          <RowBetween>
            <NetworkDropdown />
            <Menu />
          </RowBetween>
          <SearchSmall />
        </AutoColumn>
      </SmallContentGrouping>
    </HeaderFrame>
  )
}
