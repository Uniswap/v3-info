import { currentTimestamp } from './../../utils/index'
import { updateProtocolData, updateChartData } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData } from 'types'

export interface ProtocolData {
  // volume
  volumeUSD: number
  volumeUSDChange: number

  // in range liquidity
  tvlUSD: number
  tvlUSDChange: number

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
}

export const initialState: ProtocolState = {
  lastUpdated: undefined,
  data: undefined,
  chartData: undefined,
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
)
