import { DarkGreyCard, GreyCard, LightGreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import Loader from 'components/Loader'
import Percent from 'components/Percent'
import { RowBetween, RowFixed } from 'components/Row'
import useTheme from 'hooks/useTheme'
import { PageWrapper } from 'pages/styled'
import React, { useMemo } from 'react'
import { ChartDayDataAggregate, useAggregateChartData, useAggregateOverviewData } from 'state/protocol/hooks'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { unixToDate } from 'utils/date'
import { formatAmount, formatDollarAmount } from 'utils/numbers'
import CombinedBarChart from '../../components/BarChart/combined'

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  column-gap: 1rem;
`

const ChartWrapper = styled.div`
  width: 49%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

export default function Protocol() {
  const theme = useTheme()

  const { data, loading, error } = useAggregateOverviewData()

  const chartData: ChartDayDataAggregate[] | undefined = useAggregateChartData()

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          ethereum: day.volumeEthereum,
          optimism: day.volumeOptimism,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  if (!data) {
    return <Loader />
  }

  return (
    <PageWrapper>
      <AutoColumn gap="lg">
        <TYPE.main>Aggregate Uniswap V3 Data</TYPE.main>
        <CardRow>
          <GreyCard>
            <AutoColumn gap="lg">
              <TYPE.main>TVL</TYPE.main>
              <RowBetween>
                <TYPE.body fontSize="24px" fontWeight={500}>
                  {formatDollarAmount(data.tvlUSD)}
                </TYPE.body>
                <Percent value={data.tvlUSDChange} wrap={false} />
              </RowBetween>
            </AutoColumn>
          </GreyCard>
          <GreyCard>
            <AutoColumn gap="lg">
              <TYPE.main>Volume 24HR</TYPE.main>
              <RowBetween>
                <TYPE.body fontSize="24px" fontWeight={500}>
                  {formatDollarAmount(data.volumeUSD)}
                </TYPE.body>
                <Percent value={data.volumeUSDChange} wrap={false} />
              </RowBetween>
            </AutoColumn>
          </GreyCard>
          <GreyCard>
            <AutoColumn gap="lg">
              <TYPE.main>Fees 24HR</TYPE.main>
              <RowBetween>
                <TYPE.body fontSize="24px" fontWeight={500}>
                  {formatDollarAmount(data.feesUSD)}
                </TYPE.body>
                <Percent value={data.feeChange} wrap={false} />
              </RowBetween>
            </AutoColumn>
          </GreyCard>
          <GreyCard>
            <AutoColumn gap="lg">
              <TYPE.main>Transactions 24HR</TYPE.main>
              <RowBetween>
                <TYPE.body fontSize="24px" fontWeight={500}>
                  {formatAmount(data.txCount)}
                </TYPE.body>
                <Percent value={data.txCountChange} wrap={false} />
              </RowBetween>
            </AutoColumn>
          </GreyCard>
        </CardRow>
        <CombinedBarChart
          height={220}
          minHeight={332}
          data={formattedVolumeData}
          color={theme.blue1}
          // setValue={setVolumeHover}
          // setLabel={setRightLabel}
          // value={volumeHover}
          // label={rightLabel}
          topLeft={<TYPE.body fontSize="16px">Aggregate Volume</TYPE.body>}
        />
      </AutoColumn>
    </PageWrapper>
  )
}
