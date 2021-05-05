import { currentTimestamp } from './../../utils/index'
import { updatePoolData, addPoolKeys, updatePoolChartData, updatePoolTransactions, updateTickData } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { SerializedToken } from 'state/user/actions'
import { Transaction } from 'types'
import { PoolTickData } from 'data/pools/tickData'

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
    decimals: number
    derivedETH: number
  }

  token1: {
    name: string
    symbol: string
    address: string
    decimals: number
    derivedETH: number
  }

  // for tick math
  liquidity: number
  sqrtPrice: number
  tick: number

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number

  // liquidity
  tvlUSD: number
  tvlUSDChange: number

  // prices
  token0Price: number
  token1Price: number

  // token amounts
  tvlToken0: number
  tvlToken1: number
}

export type PoolChartEntry = {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
}

export interface PoolsState {
  // analytics data from
  byAddress: {
    [address: string]: {
      data: PoolData | undefined
      chartData: PoolChartEntry[] | undefined
      transactions: Transaction[] | undefined
      lastUpdated: number | undefined
      tickData: PoolTickData | undefined
    }
  }
}

export const initialState: PoolsState = { byAddress: {} }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.map(
        (poolData) =>
          (state.byAddress[poolData.address] = {
            ...state.byAddress[poolData.address],
            data: poolData,
            lastUpdated: currentTimestamp(),
          })
      )
    })
    // add address to byAddress keys if not included yet
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.map((address) => {
        if (!state.byAddress[address]) {
          state.byAddress[address] = {
            data: undefined,
            chartData: undefined,
            transactions: undefined,
            lastUpdated: undefined,
            tickData: undefined,
          }
        }
      })
    })
    .addCase(updatePoolChartData, (state, { payload: { poolAddress, chartData } }) => {
      state.byAddress[poolAddress] = { ...state.byAddress[poolAddress], chartData: chartData }
    })
    .addCase(updatePoolTransactions, (state, { payload: { poolAddress, transactions } }) => {
      state.byAddress[poolAddress] = { ...state.byAddress[poolAddress], transactions }
    })
    .addCase(updateTickData, (state, { payload: { poolAddress, tickData } }) => {
      state.byAddress[poolAddress] = { ...state.byAddress[poolAddress], tickData }
    })
)
