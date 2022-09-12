import React, { useEffect, useMemo, useState } from 'react'

import { TYPE } from '../../../theme'

import { formatDollarAmount } from '../../../utils/numbers'
import { unixToDate } from '../../../utils/date'

import { AutoColumn } from '../../../components/Column'
import { MonoSpace } from '../../../components/shared'
import LineChart from '../../../components/LineChart/alt'

import { useProtocolChartData, useProtocolData } from '../../../state/protocol/hooks'
import { useActiveNetworkVersion } from '../../../state/application/hooks'

function LineChartWrapper() {
  const [chartData] = useProtocolChartData()
  const [activeNetwork] = useActiveNetworkVersion()
  const [protocolData] = useProtocolData()

  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()

  useEffect(() => {
    setLiquidityHover(undefined)
  }, [activeNetwork])

  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
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

  return (
    <LineChart
      data={formattedTvlData}
      height={220}
      minHeight={332}
      color={activeNetwork.primaryColor}
      value={liquidityHover}
      label={leftLabel}
      setValue={setLiquidityHover}
      setLabel={setLeftLabel}
      topLeft={
        <AutoColumn gap="4px">
          <TYPE.mediumHeader fontSize="16px">TVL</TYPE.mediumHeader>
          <TYPE.largeHeader fontSize="32px">
            <MonoSpace>{formatDollarAmount(liquidityHover, 2, true)} </MonoSpace>
          </TYPE.largeHeader>
          <TYPE.main fontSize="12px" height="14px">
            {leftLabel ? <MonoSpace>{leftLabel} (UTC)</MonoSpace> : null}
          </TYPE.main>
        </AutoColumn>
      }
    />
  )
}

export default LineChartWrapper
