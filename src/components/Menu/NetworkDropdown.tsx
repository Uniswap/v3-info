import { RowFixed, RowBetween } from 'components/Row'
import { SUPPORTED_NETWORK_VERSIONS, OptimismNetworkInfo } from 'constants/networks'
import useTheme from 'hooks/useTheme'
import React, { useState, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import { useActiveNetworkVersion } from 'state/application/hooks'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { AutoColumn } from 'components/Column'

const Container = styled.div`
  position: relative;
`

const Wrapper = styled.div`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg2};
  padding: 6px 8px;
  margin-right: 12px;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const LogoWrapper = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`

const BlackBadge = styled.div`
  background-color: black;
  border-radius: 10px;
  padding: 4px 8px;
`

const FlyOut = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg1};
  padding: 16px;
  width: 270px;
`

const NetworkRow = styled(RowBetween)<{ disabled?: boolean }>`
opacity: ${({ disabled }) => (disabled ? '0.5' : 1)}
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    opacity: 0.7;
  }
`

const LightGreyBadge = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 14px;
  font-weight: 500;
`

const GreyBadge = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 6px;
  padding: 2px 6px;
  font-style: italic;
  font-size: 14px;
  font-weight: 500;
`

const GreenDot = styled.div`
  height: 8px;
  width: 8px;
  margin-right: 12px;
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
`

export default function NetworkDropdown() {
  const [activeNetwork, setActiveNetwork] = useActiveNetworkVersion()
  const theme = useTheme()

  const [showMenu, setShowMenu] = useState(false)

  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, () => setShowMenu(false))

  return (
    <Container ref={node}>
      <Wrapper onClick={() => setShowMenu(!showMenu)}>
        <RowFixed>
          <LogoWrapper src={activeNetwork.imageURL} />
          <BlackBadge>
            <TYPE.main fontSize="14px" color={theme.white}>
              {activeNetwork.name}
            </TYPE.main>
          </BlackBadge>
          <ChevronDown size="20px" />
        </RowFixed>
      </Wrapper>
      {showMenu && (
        <FlyOut>
          <AutoColumn gap="16px">
            <TYPE.main color={theme.text2} fontWeight={600} fontSize="16px">
              Select network
            </TYPE.main>
            {SUPPORTED_NETWORK_VERSIONS.map((n) => {
              return (
                <NetworkRow
                  key={n.id}
                  onClick={() => {
                    setShowMenu(false)
                    setActiveNetwork(n)
                  }}
                >
                  <RowFixed>
                    {activeNetwork.id === n.id && <GreenDot />}
                    <LogoWrapper src={n.imageURL} />
                    <TYPE.main color={theme.white}>{n.name}</TYPE.main>
                  </RowFixed>
                  {n.blurb && <LightGreyBadge>{n.blurb}</LightGreyBadge>}
                </NetworkRow>
              )
            })}
            <NetworkRow disabled={true}>
              <RowFixed>
                <LogoWrapper src={OptimismNetworkInfo.imageURL} />
                <TYPE.main color={theme.white}>{OptimismNetworkInfo.name}</TYPE.main>
              </RowFixed>
              <GreyBadge>Coming Soon</GreyBadge>
            </NetworkRow>
          </AutoColumn>
        </FlyOut>
      )}
    </Container>
  )
}
