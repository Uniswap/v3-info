import { useMemo } from 'react'
import { PoolChartEntry } from 'state/pools/reducer'
import { TokenChartEntry } from 'state/tokens/reducer'
import { ChartDayData, GenericChartEntry } from 'types'
import { unixToDate } from 'utils/date'
import dayjs from 'dayjs'

export function unixToWeek(unix: number): number {
  return dayjs.unix(unix).utc().week()
}

export function unixToMonth(unix: number): number {
  return dayjs.unix(unix).utc().month()
}

export function useTransformedVolumeData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      let currentIndex = -1
      const data: GenericChartEntry[] = []
      chartData.forEach((day: { date: number; volumeUSD: number }) => {
        const index = type === 'month' ? unixToMonth(day.date) : unixToWeek(day.date)
        let needsDateUpdate = false
        if (index !== currentIndex) {
          currentIndex = index
          needsDateUpdate = true
        }
        data[currentIndex] = data[currentIndex] || {}
        if (needsDateUpdate) {
          data[currentIndex].time = unixToDate(day.date)
        }
        data[currentIndex].value = (data[currentIndex].value ?? 0) + day.volumeUSD
      })
      return data.filter((x) => !!x)
    } else {
      return []
    }
  }, [chartData, type])
}
