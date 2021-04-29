import React, { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { DarkGreyCard } from 'components/Card'
import { TokenData } from '../../state/tokens/reducer'
import { useAllTokenData } from 'state/tokens/hooks'
import Loader from 'components/Loader'
import { Link } from 'react-router-dom'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { Token } from '@uniswap/sdk'
import { Label, ClickableText } from '../Text'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 20px 1.5fr repeat(5, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(4, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }
`

const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  const mockCurrency1 = new Token(1, tokenData.address, 0, tokenData.symbol, tokenData.name)
  return (
    <LinkWrapper to={'tokens/' + tokenData.address}>
      <ResponsiveGrid>
        <Label>{index + 1}</Label>
        <Label>
          <RowFixed>
            <CurrencyLogo currency={mockCurrency1} />
          </RowFixed>
          <TYPE.label ml="8px">
            {tokenData.symbol} ({tokenData.name})
          </TYPE.label>
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(tokenData.priceUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          <Percent value={tokenData.priceUSDChange} />
        </Label>
        <Label end={1} fontWeight={400}>
          <Percent value={tokenData.priceUSDChangeWeek} />
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(tokenData.volumeUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(tokenData.tvlUSD)}
        </Label>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

export default function TokenTable() {
  const allTokenData = useAllTokenData()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const sortedTokens = useMemo(() => {
    return allTokenData
      ? Object.keys(allTokenData)
          .map((address) => {
            return allTokenData[address].data
          })
          .filter((x) => !!x)
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
      : []
  }, [allTokenData, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField]
  )

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField]
  )

  if (!allTokenData) {
    return <Loader />
  }

  return (
    <Wrapper>
      <AutoColumn gap="lg">
        <ResponsiveGrid>
          <Label>#</Label>
          <ClickableText onClick={() => handleSort(SORT_FIELD.name)}>Name {arrow(SORT_FIELD.name)}</ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSD)}>
            Price {arrow(SORT_FIELD.priceUSD)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChange)}>
            24Hr {arrow(SORT_FIELD.priceUSDChange)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
            Volume {arrow(SORT_FIELD.volumeUSD)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
            TVL {arrow(SORT_FIELD.tvlUSD)}
          </ClickableText>
        </ResponsiveGrid>
        {sortedTokens.map((data, i) => {
          if (data) {
            return <DataRow index={i} key={i} tokenData={data} />
          }
          return null
        })}
      </AutoColumn>
    </Wrapper>
  )
}
