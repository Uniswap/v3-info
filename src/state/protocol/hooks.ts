import { optimismClient } from './../../apollo/client'
import { useFetchGlobalChartData } from 'data/protocol/chart'
import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { AppState, AppDispatch } from './../index'
import { ProtocolData } from './reducer'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChartDayData, Transaction } from 'types'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { useFetchAggregateProtocolData } from 'data/protocol/overview'
import { client } from 'apollo/client'

export function useProtocolData(): [ProtocolData | undefined, (protocolData: ProtocolData) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const protocolData: ProtocolData | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.data
  )

  const dispatch = useDispatch<AppDispatch>()
  const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
    (protocolData: ProtocolData) => dispatch(updateProtocolData({ protocolData, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [protocolData, setProtocolData]
}

export function useProtocolChartData(): [ChartDayData[] | undefined, (chartData: ChartDayData[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const chartData: ChartDayData[] | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.chartData
  )

  const dispatch = useDispatch<AppDispatch>()
  const setChartData: (chartData: ChartDayData[]) => void = useCallback(
    (chartData: ChartDayData[]) => dispatch(updateChartData({ chartData, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [chartData, setChartData]
}

export function useProtocolTransactions(): [Transaction[] | undefined, (transactions: Transaction[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const transactions: Transaction[] | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.transactions
  )
  const dispatch = useDispatch<AppDispatch>()
  const setTransactions: (transactions: Transaction[]) => void = useCallback(
    (transactions: Transaction[]) => dispatch(updateTransactions({ transactions, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [transactions, setTransactions]
}

export function useAggregateOverviewData() {
  return useFetchAggregateProtocolData()
}

export interface ChartDayDataAggregate {
  date: number
  volumeEthereum: number
  tvlEthereum: number
  volumeOptimism: number
  tvlOptimism: number
}

export function useAggregateChartData(): ChartDayDataAggregate[] | undefined {
  const { data, error } = useFetchGlobalChartData(client)
  const { data: optimismData, error: optimismError } = useFetchGlobalChartData(optimismClient)

  // map over all data - use ethereum as base as has all dates
  const combined: ChartDayDataAggregate[] | undefined = useMemo(() => {
    if (!data || !optimismData || error || optimismError) {
      return undefined
    }

    return data.reduce((accum: ChartDayDataAggregate[], currentDay) => {
      const optimismIndex = optimismData.findIndex((d) => d.date === currentDay.date)
      const optimismDayData = optimismData[optimismIndex]

      return [
        ...accum,
        // combine with optimism
        {
          date: currentDay.date,
          volumeEthereum: currentDay.volumeUSD,
          tvlEthereum: currentDay.tvlUSD,
          volumeOptimism: optimismDayData?.volumeUSD ?? 0,
          tvlOptimism: optimismDayData?.tvlUSD ?? 0,
        },
      ]
    }, [])
  }, [data, error, optimismData, optimismError])

  return combined
}
