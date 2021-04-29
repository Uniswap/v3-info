import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { TYPE } from 'theme'
import { DarkGreyCard, GreyBadge } from 'components/Card'
import Loader from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Token } from '@uniswap/sdk'
import { feeTierPercent } from 'utils'
import { Label, ClickableText } from 'components/Text'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 20px 1.5fr repeat(3, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
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
  }
`

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
}

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  const mockCurrency0 = new Token(1, poolData.token0.address, 0, poolData.token0.symbol, poolData.token0.name)
  const mockCurrency1 = new Token(1, poolData.token1.address, 0, poolData.token1.symbol, poolData.token1.name)
  return (
    <LinkWrapper to="tokens/">
      <ResponsiveGrid>
        <Label>{index + 1}</Label>
        <Label>
          <RowFixed>
            <DoubleCurrencyLogo currency0={mockCurrency0} currency1={mockCurrency1} />
            <TYPE.label ml="8px">
              {poolData.token0.symbol}/{poolData.token1.symbol}
            </TYPE.label>
            <GreyBadge ml="10px">{feeTierPercent(poolData.feeTier)}</GreyBadge>
          </RowFixed>
        </Label>
        <Label end={1}>{formatDollarAmount(poolData.tvlUSD)}</Label>
        <Label end={1}>{formatDollarAmount(poolData.volumeUSD)}</Label>
        <Label end={1}>{formatDollarAmount(poolData.volumeUSDWeek)}</Label>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

export default function PoolTable({ poolDatas }: { poolDatas: PoolData[] }) {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .filter((x) => !!x)
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
      : []
  }, [poolDatas, sortDirection, sortField])

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

  if (!poolDatas) {
    return <Loader />
  }

  return (
    <Wrapper>
      <AutoColumn gap="lg">
        <ResponsiveGrid>
          <Label>#</Label>
          <ClickableText onClick={() => handleSort(SORT_FIELD.feeTier)}>Pool {arrow(SORT_FIELD.feeTier)}</ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
            TVL {arrow(SORT_FIELD.tvlUSD)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
            24hr Volume {arrow(SORT_FIELD.volumeUSD)}
          </ClickableText>
          <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
            7d Volume {arrow(SORT_FIELD.volumeUSDWeek)}
          </ClickableText>
        </ResponsiveGrid>
        {sortedPools.map((poolData, i) => {
          if (poolData) {
            return <DataRow index={i} key={i} poolData={poolData} />
          }
          return null
        })}
      </AutoColumn>
    </Wrapper>
  )
}
