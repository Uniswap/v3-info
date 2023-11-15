import { currentTimestamp } from './../../utils/index'
import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData, Transaction } from 'types'
import { SupportedNetwork } from 'constants/networks'

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
  [networkId: string]: {
    // timestamp for last updated fetch
    readonly lastUpdated: number | undefined
    // overview data
    readonly data: ProtocolData | undefined
    readonly chartData: ChartDayData[] | undefined
    readonly transactions: Transaction[] | undefined
  }
}

const DEFAULT_INITIAL_STATE = {
  data: undefined,
  chartData: undefined,
  transactions: undefined,
  lastUpdated: undefined,
}

export const initialState: ProtocolState = {
  [SupportedNetwork.ETHEREUM]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.ARBITRUM]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.OPTIMISM]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.POLYGON]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.CELO]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.BNB]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.AVALANCHE]: DEFAULT_INITIAL_STATE,
  [SupportedNetwork.BASE]: DEFAULT_INITIAL_STATE,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProtocolData, (state, { payload: { protocolData, networkId } }) => {
      state[networkId].data = protocolData
      // mark when last updated
      state[networkId].lastUpdated = currentTimestamp()
    })
    .addCase(updateChartData, (state, { payload: { chartData, networkId } }) => {
      state[networkId].chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions, networkId } }) => {
      state[networkId].transactions = transactions
    }),
)
