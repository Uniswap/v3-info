import React, { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAllTokenData } from 'state/tokens/hooks'
import { ScrollableX, GreyCard } from 'components/Card'
import { TokenData } from 'state/tokens/reducer'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowFlat } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE, StyledInternalLink } from 'theme'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import HoverInlineText from 'components/HoverInlineText'

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

export default function TopTokenMovers() {
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

  const increaseContainer = document.getElementById('increaseContainer')
  const increaseContainerWidth = increaseContainer?.scrollWidth
  const [increaseSet, setIncreaseSet] = useState(false)
  useEffect(() => {
    if (!increaseSet && increaseContainer) {
      self.setInterval(() => {
        if (increaseContainer.scrollLeft !== increaseContainerWidth) {
          increaseContainer.scrollTo(increaseContainer.scrollLeft + 1, 0)
        }
      }, 80)
      setIncreaseSet(true)
    }
  }, [increaseContainer, increaseContainerWidth, increaseSet])

  const decreaseContainer = document.getElementById('decreaseContainer')
  const decreaseContainerWidth = increaseContainer?.scrollWidth
  const [decreaseSet, setDecreaseSet] = useState(false)
  useEffect(() => {
    if (!decreaseSet && decreaseContainer) {
      self.setInterval(() => {
        if (decreaseContainer.scrollLeft !== decreaseContainerWidth) {
          decreaseContainer.scrollTo(decreaseContainer.scrollLeft - 1, 0)
        }
      }, 80)
      setDecreaseSet(true)
    }
  }, [decreaseContainer, increaseSet, decreaseContainerWidth, decreaseSet])

  // auto scroll bottom to end
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (decreaseContainer && decreaseContainerWidth && !scrolled) {
      decreaseContainer.scrollTo(decreaseContainerWidth - 1, 0)
      setScrolled(true)
    }
  }, [decreaseContainer, decreaseContainerWidth, scrolled])

  return (
    <AutoColumn gap="md">
      <ScrollableX id="increaseContainer">
        {topPriceIncrease.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableX>
      <ScrollableX id="decreaseContainer">
        {topPriceDecrease.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableX>
    </AutoColumn>
  )
}
