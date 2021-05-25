import React, { useMemo, RefObject } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAllTokenData } from 'state/tokens/hooks'
import { GreyCard } from 'components/Card'
import { TokenData } from 'state/tokens/reducer'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowFlat } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE, StyledInternalLink } from 'theme'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import HoverInlineText from 'components/HoverInlineText'

const scroll = keyframes`
  0% { margin-left: 0%; }
  100% { margin-left: -71.5%; }
`

const Container = styled(StyledInternalLink)`
  min-width: 190px;
  margin-right: 16px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const Wrapper = styled(GreyCard)`
  padding: 10px;
`

export const ScrollableRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  white-space: nowrap;

  animation: ${scroll};
  animation-duration: 10s;
  animation-timing-function: linear;
  animation-delay: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;

  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <Container to={'tokens/' + tokenData.address}>
      <Wrapper>
        <RowFixed>
          <CurrencyLogo address={tokenData.address} size="32px" />
          <AutoColumn gap="3px" style={{ marginLeft: '12px' }}>
            <TYPE.label fontSize="14px">
              <HoverInlineText text={tokenData.symbol} />
            </TYPE.label>
            <RowFlat>
              <TYPE.label fontSize="14px" mr="6px" lineHeight="16px">
                {formatDollarAmount(tokenData.priceUSD)}
              </TYPE.label>
              <Percent fontSize="14px" value={tokenData.priceUSDChange} />
            </RowFlat>
          </AutoColumn>
        </RowFixed>
      </Wrapper>
    </Container>
  )
}

export default function TopTokenMovers({ parentRef }: { parentRef: RefObject<HTMLDivElement> }) {
  const allTokens = useAllTokenData()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        return a && b ? (a?.priceUSDChange > b?.priceUSDChange ? -1 : 1) : -1
      })
      .slice(0, Math.min(20, Object.values(allTokens).length))
  }, [allTokens])

  const topPriceDecrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        return a && b ? (a?.priceUSDChange > b?.priceUSDChange ? 1 : -1) : 1
      })
      .slice(0, Math.min(20, Object.values(allTokens).length))
      .reverse()
  }, [allTokens])

  return (
    <AutoColumn gap="md" style={{ overflow: 'hidden', maxWidth: '1200px' }}>
      <ScrollableRow>
        {topPriceIncrease.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableRow>
      <ScrollableRow>
        {topPriceDecrease.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableRow>
    </AutoColumn>
  )
}
