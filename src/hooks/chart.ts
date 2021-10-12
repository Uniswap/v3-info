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

export function useWeeklyVolumeData(chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined) {
  return useMemo(() => {
    if (chartData) {
      let currentWeekIndex = -1
      const weeklyData: GenericChartEntry[] = []
      chartData.forEach((day: { date: number; volumeUSD: number }) => {
        const weekIndex = unixToWeek(day.date)
        if (weekIndex !== currentWeekIndex) {
          currentWeekIndex = weekIndex
        }
        weeklyData[currentWeekIndex] = weeklyData[currentWeekIndex] || {}
        weeklyData[currentWeekIndex].time = unixToDate(day.date)
        weeklyData[currentWeekIndex].value = (weeklyData[currentWeekIndex].value ?? 0) + day.volumeUSD
      })
      return weeklyData.filter((x) => !!x)
    } else {
      return []
    }
  }, [chartData])
}

export function useMonthlyVolumeData(chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined) {
  return useMemo(() => {
    if (chartData) {
      let currentIndex = -1
      const monthlyData: GenericChartEntry[] = []
      chartData.forEach((day: { date: number; volumeUSD: number }) => {
        const index = unixToMonth(day.date)
        if (index !== currentIndex) {
          currentIndex = index
        }
        monthlyData[currentIndex] = monthlyData[currentIndex] || {}
        monthlyData[currentIndex].time = unixToDate(day.date)
        monthlyData[currentIndex].value = (monthlyData[currentIndex].value ?? 0) + day.volumeUSD
      })
      return monthlyData.filter((x) => !!x)
    } else {
      return []
    }
  }, [chartData])
}
