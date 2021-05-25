import { currentTimestamp } from './../../utils/index'
import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData, Transaction } from 'types'

export interface ProtocolData {
  // volume
  volumeUSD: number
  volumeUSDChange: number

  // in range liquidity
  tvlUSD: number
  tvlUSDChange: number

  // fees
  feesUSD: number
  feeChange: number

  // transactions
  txCount: number
  txCountChange: number
}

export interface ProtocolState {
  // timestamp for last updated fetch
  readonly lastUpdated: number | undefined

  // overview data
  readonly data: ProtocolData | undefined

  readonly chartData: ChartDayData[] | undefined

  readonly transactions: Transaction[] | undefined
}

export const initialState: ProtocolState = {
  data: undefined,
  chartData: undefined,
  transactions: undefined,
  lastUpdated: undefined,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProtocolData, (state, { payload: { protocolData } }) => {
      state.data = protocolData
      // mark when last updated
      state.lastUpdated = currentTimestamp()
    })
    .addCase(updateChartData, (state, { payload: { chartData } }) => {
      state.chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions } }) => {
      state.transactions = transactions
    })
)
