import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween, RowFixed } from 'components/Row'
import LineChart from 'components/LineChart'
import useTheme from 'hooks/useTheme'
import { useProtocolData, useProtocolChartData, useProtocolTransactions } from 'state/protocol/hooks'
import { DarkGreyCard } from 'components/Card'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { StyledInternalLink } from '../../theme/components'
import TokenTable from 'components/tokens/TokenTable'
import PoolTable from 'components/pools/PoolTable'
import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled'
import { unixToDate } from 'utils/date'
import BarChart from 'components/BarChart'
import { useAllPoolData } from 'state/pools/hooks'
import { notEmpty } from 'utils'
import TransactionsTable from '../../components/TransactionsTable'
import { useAllTokenData } from 'state/tokens/hooks'

const ChartWrapper = styled.div`
  width: 49%;
`

export default function Home() {
  const theme = useTheme()

  const [protocolData] = useProtocolData()
  const [chartData] = useProtocolChartData()
  const [transactions] = useProtocolTransactions()

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (!volumeHover && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  useEffect(() => {
    if (!liquidityHover && protocolData) {
      setLiquidityHover(protocolData.tvlUSD)
    }
  }, [liquidityHover, protocolData])

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.tvlUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const allTokens = useAllTokenData()
  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((t) => t.data)
      .filter(notEmpty)
  }, [allTokens])

  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={'#fc077d'} />
      <AutoColumn gap="30px">
        <TYPE.mediumHeader>Uniswap Overview</TYPE.mediumHeader>
        <RowBetween>
          <ChartWrapper>
            <LineChart
              data={formattedTvlData}
              height={220}
              minHeight={332}
              color={theme.pink1}
              setValue={setLiquidityHover}
              topLeft={
                <AutoColumn gap="md">
                  <TYPE.mediumHeader fontSize="16px">TVL</TYPE.mediumHeader>
                  <TYPE.largeHeader fontSize="32px">{formatDollarAmount(liquidityHover, 2, true)}</TYPE.largeHeader>
                </AutoColumn>
              }
            />
          </ChartWrapper>
          <ChartWrapper>
            <BarChart
              height={220}
              minHeight={332}
              data={formattedVolumeData}
              color={theme.blue1}
              setValue={setVolumeHover}
              topLeft={
                <AutoColumn gap="md">
                  <TYPE.mediumHeader fontSize="16px">24HR Volume</TYPE.mediumHeader>
                  <TYPE.largeHeader fontSize="32px">{formatDollarAmount(volumeHover, 2, true)}</TYPE.largeHeader>
                </AutoColumn>
              }
            />
          </ChartWrapper>
        </RowBetween>
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="20px">
                <TYPE.main mr="4px">24HR USD: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.volumeUSD)}</TYPE.label>
                <Percent value={protocolData?.volumeUSDChange} wrap={true} />
              </RowFixed>
              <RowFixed mr="20px">
                <TYPE.main mr="4px">24HR Transcations: </TYPE.main>
                <TYPE.label mr="4px">{protocolData?.txCount}</TYPE.label>
                <Percent value={protocolData?.txCountChange} wrap={true} />
              </RowFixed>
              <RowFixed mr="20px">
                <TYPE.main mr="4px">TVL USD: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.tvlUSD)}</TYPE.label>
                <Percent value={protocolData?.tvlUSDChange} wrap={true} />
              </RowFixed>
            </RowFixed>
          </RowBetween>
        </DarkGreyCard>
        <RowBetween>
          <TYPE.mediumHeader>Top Tokens</TYPE.mediumHeader>
          <StyledInternalLink to="/tokens" fontSize="20px">
            Explore
          </StyledInternalLink>
        </RowBetween>
        {/* <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopTokenMovers />
          </AutoColumn>
        </OutlineCard> */}
        <TokenTable tokenDatas={formattedTokens} />
        <RowBetween>
          <TYPE.mediumHeader>Top Pools</TYPE.mediumHeader>
          <StyledInternalLink to="/pools" fontSize="20px">
            Explore
          </StyledInternalLink>
        </RowBetween>
        {/* <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopPoolMovers />
          </AutoColumn>
        </OutlineCard> */}
        <PoolTable poolDatas={poolDatas} />
        <RowBetween>
          <TYPE.mediumHeader>Transaction</TYPE.mediumHeader>
          <StyledInternalLink to="/transactions" fontSize="20px">
            Explore
          </StyledInternalLink>
        </RowBetween>
        {transactions ? <TransactionsTable transactions={transactions} /> : null}
      </AutoColumn>
    </PageWrapper>
  )
}
