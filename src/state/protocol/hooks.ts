import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { AppState, AppDispatch } from './../index'
import { ProtocolData } from './reducer'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChartDayData, Transaction } from 'types'

export function useProtocolData(): [ProtocolData | undefined, (protocolData: ProtocolData) => void] {
  const protocolData: ProtocolData | undefined = useSelector((state: AppState) => state.protocol.data)

  const dispatch = useDispatch<AppDispatch>()
  const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
    (protocolData: ProtocolData) => dispatch(updateProtocolData({ protocolData })),
    [dispatch]
  )

  return [protocolData, setProtocolData]
}

export function useProtocolChartData(): [ChartDayData[] | undefined, (chartData: ChartDayData[]) => void] {
  const chartData: ChartDayData[] | undefined = useSelector((state: AppState) => state.protocol.chartData)
  const dispatch = useDispatch<AppDispatch>()
  const setChartData: (chartData: ChartDayData[]) => void = useCallback(
    (chartData: ChartDayData[]) => dispatch(updateChartData({ chartData })),
    [dispatch]
  )
  return [chartData, setChartData]
}

export function useProtocolTransactions(): [Transaction[] | undefined, (transactions: Transaction[]) => void] {
  const transactions: Transaction[] | undefined = useSelector((state: AppState) => state.protocol.transactions)
  const dispatch = useDispatch<AppDispatch>()
  const setTransactions: (transactions: Transaction[]) => void = useCallback(
    (transactions: Transaction[]) => dispatch(updateTransactions({ transactions })),
    [dispatch]
  )
  return [transactions, setTransactions]
}
