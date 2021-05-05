import React, { useCallback, useState, useMemo, useEffect } from 'react'
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
import { feeTierPercent } from 'utils'
import { Label, ClickableText } from 'components/Text'
import { PageButtons, Arrow } from 'components/shared'
import { POOL_HIDE } from '../../constants/index'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 20px 1.5fr repeat(3, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 1.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
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
  return (
    <LinkWrapper to={'/pools/' + poolData.address}>
      <ResponsiveGrid>
        <Label>{index + 1}</Label>
        <Label>
          <RowFixed>
            <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
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

export default function PoolTable({ poolDatas, maxItems = 10 }: { poolDatas: PoolData[]; maxItems?: number }) {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
  }, [maxItems, poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .filter((x) => !!x && !POOL_HIDE.includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [maxItems, page, poolDatas, sortDirection, sortField])

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
        <PageButtons>
          <div
            onClick={() => {
              setPage(page === 1 ? page : page - 1)
            }}
          >
            <Arrow faded={page === 1 ? true : false}>←</Arrow>
          </div>
          <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
          <div
            onClick={() => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            <Arrow faded={page === maxPage ? true : false}>→</Arrow>
          </div>
        </PageButtons>
      </AutoColumn>
    </Wrapper>
  )
}
