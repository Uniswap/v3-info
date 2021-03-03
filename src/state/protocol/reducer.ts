import { updateProtocolData } from './actions'
import { createReducer } from '@reduxjs/toolkit'

export interface ProtocolData {
  // volume
  usdVolume: number
  usdVolumeChange: number

  // in range liquidity
  liquidityUsd: number
  liquidityChange: number

  // transactions
  txnCount: number
  txnCountChange: number
}

export interface ProtocolState {
  // timestamp for last updated fetch
  lastUpdated: string | undefined

  // analytics data from subgraph
  data: ProtocolData | undefined
}

export const initialState: ProtocolState = {
  lastUpdated: undefined,
  data: undefined,
}

export default createReducer(initialState, (builder) => builder.addCase(updateProtocolData, (state) => {}))
