import { currentTimestamp } from './../../utils/index'
import { updateProtocolData } from './actions'
import { createReducer } from '@reduxjs/toolkit'

export interface ProtocolData {
  // volume
  volumeUSD: number
  volumeUSDChange: number

  // in range liquidity
  liquidityUSD: number
  liquidityUSDChange: number

  // transactions
  txnCount: number
  txnCountChange: number
}

export interface ProtocolState {
  // timestamp for last updated fetch
  readonly lastUpdated: number | undefined

  // analytics data from subgraph
  readonly data: ProtocolData | undefined
}

export const initialState: ProtocolState = {
  lastUpdated: undefined,
  data: undefined,
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateProtocolData, (state, { payload: { protocolData } }) => {
    state.data = protocolData
    // mark when last updated
    state.lastUpdated = currentTimestamp()
  })
)
