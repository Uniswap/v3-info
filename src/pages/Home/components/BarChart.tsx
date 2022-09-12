import React, { useEffect, useMemo, useState } from 'react'

import { TYPE } from '../../../theme'

import { formatDollarAmount } from '../../../utils/numbers'
import { unixToDate } from '../../../utils/date'

import { AutoColumn } from '../../../components/Column'
import { MonoSpace } from '../../../components/shared'
import { RowFixed } from '../../../components/Row'
import { SmallOptionButton } from '../../../components/Button'
import BarChart from '../../../components/BarChart/alt'

import { VolumeWindow } from '../../../types'

import useTheme from '../../../hooks/useTheme'
import { useTransformedVolumeData } from '../../../hooks/chart'

import { useProtocolChartData, useProtocolData } from '../../../state/protocol/hooks'
import { useActiveNetworkVersion } from '../../../state/application/hooks'

function BarChartWrapper() {
  const [chartData] = useProtocolChartData()
  const [activeNetwork] = useActiveNetworkVersion()
  const [protocolData] = useProtocolData()

  const theme = useTheme()

  const [rightLabel, setRightLabel] = useState<string | undefined>()
  const [volumeHover, setVolumeHover] = useState<number | undefined>()

  useEffect(() => {
    setVolumeHover(undefined)
  }, [activeNetwork])

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (volumeHover === undefined && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])

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

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.daily)

  return (
    <BarChart
      height={220}
      minHeight={332}
      data={
        volumeWindow === VolumeWindow.monthly
          ? monthlyVolumeData
          : volumeWindow === VolumeWindow.weekly
          ? weeklyVolumeData
          : formattedVolumeData
      }
      color={theme.blue1}
      setValue={setVolumeHover}
      setLabel={setRightLabel}
      value={volumeHover}
      label={rightLabel}
      activeWindow={volumeWindow}
      topRight={
        <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
          <SmallOptionButton
            active={volumeWindow === VolumeWindow.daily}
            onClick={() => setVolumeWindow(VolumeWindow.daily)}
          >
            D
          </SmallOptionButton>
          <SmallOptionButton
            active={volumeWindow === VolumeWindow.weekly}
            style={{ marginLeft: '8px' }}
            onClick={() => setVolumeWindow(VolumeWindow.weekly)}
          >
            W
          </SmallOptionButton>
          <SmallOptionButton
            active={volumeWindow === VolumeWindow.monthly}
            style={{ marginLeft: '8px' }}
            onClick={() => setVolumeWindow(VolumeWindow.monthly)}
          >
            M
          </SmallOptionButton>
        </RowFixed>
      }
      topLeft={
        <AutoColumn gap="4px">
          <TYPE.mediumHeader fontSize="16px">Volume 24H</TYPE.mediumHeader>
          <TYPE.largeHeader fontSize="32px">
            <MonoSpace> {formatDollarAmount(volumeHover, 2)}</MonoSpace>
          </TYPE.largeHeader>
          <TYPE.main fontSize="12px" height="14px">
            {rightLabel ? <MonoSpace>{rightLabel} (UTC)</MonoSpace> : null}
          </TYPE.main>
        </AutoColumn>
      }
    />
  )
}

export default BarChartWrapper
