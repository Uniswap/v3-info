import { RowFixed, RowBetween } from 'components/Row'
import { CeloNetworkInfo, PolygonNetworkInfo, SUPPORTED_NETWORK_VERSIONS } from 'constants/networks'
import useTheme from 'hooks/useTheme'
import React, { useState, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import { useActiveNetworkVersion } from 'state/application/hooks'
import styled from 'styled-components'
import { StyledInternalLink, TYPE } from 'theme'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { AutoColumn } from 'components/Column'
import { EthereumNetworkInfo } from '../../constants/networks'

const Container = styled.div`
  position: relative;
  z-index: 40;
`

const Wrapper = styled.div`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg1};
  padding: 6px 8px;
  margin-right: 12px;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const LogaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const LogoWrapper = styled.img`
  width: 20px;
  height: 20px;
`

const FlyOut = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  position: absolute;
  top: 40px;
  left: 0;
  border-radius: 12px;
  padding: 16px;
  width: 270px;
`

const NetworkRow = styled(RowBetween)<{ active?: boolean; disabled?: boolean }>`
  padding: 6px 8px;
  background-color: ${({ theme, active }) => (active ? theme.bg2 : theme.bg1)};
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? '0.5' : 1)};
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 0.7)};
  }
`

const Badge = styled.div<{ bgColor?: string }>`
  background-color: ${({ theme, bgColor }) => bgColor ?? theme.bg4};
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
`

const GreenDot = styled.div`
  height: 12px;
  width: 12px;
  margin-right: 12px;
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  position: absolute;
  border: 2px solid black;
  right: -16px;
  bottom: -4px;
`

export default function NetworkDropdown() {
  const [activeNetwork] = useActiveNetworkVersion()
  const theme = useTheme()

  const [showMenu, setShowMenu] = useState(false)

  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, () => setShowMenu(false))

  return (
    <Container ref={node}>
      <Wrapper onClick={() => setShowMenu(!showMenu)}>
        <RowFixed>
          <LogoWrapper src={activeNetwork.imageURL} />
          <TYPE.main fontSize="14px" color={theme.white} ml="8px" mt="-2px" mr="2px" style={{ whiteSpace: 'nowrap' }}>
            {activeNetwork.name}
          </TYPE.main>
          {[EthereumNetworkInfo, PolygonNetworkInfo, CeloNetworkInfo].includes(activeNetwork) ? null : (
            <Badge bgColor={activeNetwork.primaryColor} style={{ margin: '0 4px' }}>
              L2
            </Badge>
          )}
          <ChevronDown size="20px" />
        </RowFixed>
      </Wrapper>
      {showMenu && (
        <FlyOut>
          <AutoColumn gap="16px">
            <TYPE.main color={theme.text3} fontWeight={600} fontSize="16px">
              Select network
            </TYPE.main>
            {SUPPORTED_NETWORK_VERSIONS.map((n) => {
              return (
                <StyledInternalLink key={n.id} to={`${n === EthereumNetworkInfo ? '' : '/' + n.route}/`}>
                  <NetworkRow
                    onClick={() => {
                      setShowMenu(false)
                    }}
                    active={activeNetwork.id === n.id}
                  >
                    <RowFixed>
                      <LogaContainer>
                        <LogoWrapper src={n.imageURL} />
                        {activeNetwork.id === n.id && <GreenDot />}
                      </LogaContainer>
                      <TYPE.main ml="12px" color={theme.white}>
                        {n.name}
                      </TYPE.main>
                    </RowFixed>
                    {n.blurb && <Badge>{n.blurb}</Badge>}
                  </NetworkRow>
                </StyledInternalLink>
              )
            })}
          </AutoColumn>
        </FlyOut>
      )}
    </Container>
  )
}
