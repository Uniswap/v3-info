import { currentTimestamp } from './../../utils/index'
import { updatePoolData, addPoolKeys } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { SerializedToken } from 'state/user/actions'

export interface Pool {
  address: string
  token0: SerializedToken
  token1: SerializedToken
}

export interface PoolData {
  // basic token info
  address: string
  feeTier: number

  token0: {
    name: string
    symbol: string
    address: string
  }

  token1: {
    name: string
    symbol: string
    address: string
  }

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number

  // liquidity
  tvlUSD: number
  tvlUSDChange: number

  // token amounts
  tvlToken0: number
  tvlToken1: number
}

export interface PoolsState {
  // analytics data from
  byAddress: { [address: string]: { data: PoolData | undefined; lastUpdated: number | undefined } }
}

export const initialState: PoolsState = { byAddress: {} }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.map((poolData) => (state.byAddress[poolData.address] = { data: poolData, lastUpdated: currentTimestamp() }))
    })
    // add address to byAddress keys if not included yet
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.map((address) => {
        if (!state.byAddress[address]) {
          state.byAddress[address] = { data: undefined, lastUpdated: undefined }
        }
      })
    })
)
