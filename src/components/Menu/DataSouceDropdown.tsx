import { RowFixed } from 'components/Row'
import useTheme from 'hooks/useTheme'
import React, { useState, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import { useAlternateL1DataSource } from 'state/application/hooks'
import styled from 'styled-components'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'

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

const DataSourceOption = styled.div`
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
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

const GRAPH_LOGO_ADDRESS =
  'https://w7.pngwing.com/pngs/338/918/png-transparent-the-graph-grt-coin-cryptocoin-exchange-coins-crypto-blockchain-cryptocurrency-logo-glyph-icon.png'
const GOLDKSY_LOGO_ADDRESS =
  'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ro3dajnkee1js9y98j64'

export default function DataSourceDropdown() {
  const theme = useTheme()

  const [isAlternate, setIsAlternate] = useAlternateL1DataSource()

  const [showMenu, setShowMenu] = useState(false)

  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, () => setShowMenu(false))

  return (
    <Container ref={node}>
      <Wrapper onClick={() => setShowMenu(!showMenu)}>
        <RowFixed>
          <LogoWrapper
            src={isAlternate ? GOLDKSY_LOGO_ADDRESS : GRAPH_LOGO_ADDRESS}
            style={{ borderRadius: '4px', overflow: 'hidden' }}
          />
          <TYPE.main fontSize="14px" color={theme.white} ml="8px" mt="-2px" mr="2px" style={{ whiteSpace: 'nowrap' }}>
            {isAlternate ? 'Goldsky' : 'Subgraph'}
          </TYPE.main>
          <ChevronDown size="20px" />
        </RowFixed>
      </Wrapper>
      {showMenu && (
        <FlyOut>
          <AutoColumn gap="16px">
            <TYPE.main color={theme.text3} fontWeight={600} fontSize="16px">
              Select data source
            </TYPE.main>
            <DataSourceOption>
              <TYPE.main color={theme.white} onClick={() => setIsAlternate(true)} style={{ cursor: 'pointer' }}>
                Goldsky
              </TYPE.main>
            </DataSourceOption>
            <DataSourceOption>
              <TYPE.main color={theme.white} onClick={() => setIsAlternate(false)} style={{ cursor: 'pointer' }}>
                Subgraph
              </TYPE.main>
            </DataSourceOption>
          </AutoColumn>
        </FlyOut>
      )}
    </Container>
  )
}
