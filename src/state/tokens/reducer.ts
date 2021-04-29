import { currentTimestamp } from './../../utils/index'
import { updateTokenData, addTokenKeys, addPoolAddresses, updateChartData, updatePriceData } from './actions'
import { createReducer } from '@reduxjs/toolkit'

export type TokenData = {
  // basic token info
  name: string
  symbol: string
  address: string

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  txCount: number

  // tvl
  tvlToken: number
  tvlUSD: number
  tvlUSDChange: number

  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
}

export interface TokenChartEntry {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
}

export interface TokenPriceEntry {
  timestamp: string
  open: number
  close: number
}

export interface TokensState {
  // analytics data from
  byAddress: {
    [address: string]: {
      data: TokenData | undefined
      poolAddresses: string[] | undefined
      chartData: TokenChartEntry[] | undefined
      priceData: {
        [secondsInterval: number]: TokenPriceEntry[] | undefined
      }

      lastUpdated: number | undefined
    }
  }
}

export const initialState: TokensState = { byAddress: {} }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateTokenData, (state, { payload: { tokens } }) => {
      tokens.map(
        (tokenData) =>
          (state.byAddress[tokenData.address] = {
            ...state.byAddress[tokenData.address],
            data: tokenData,
            lastUpdated: currentTimestamp(),
          })
      )
    }) // add address to byAddress keys if not included yet
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses } }) => {
      tokenAddresses.map((address) => {
        if (!state.byAddress[address]) {
          state.byAddress[address] = {
            poolAddresses: undefined,
            data: undefined,
            chartData: undefined,
            priceData: {},
            lastUpdated: undefined,
          }
        }
      })
    })
    // add list of pools the token is included in
    .addCase(addPoolAddresses, (state, { payload: { tokenAddress, poolAddresses } }) => {
      state.byAddress[tokenAddress] = { ...state.byAddress[tokenAddress], poolAddresses }
    })

    // add list of pools the token is included in
    .addCase(updateChartData, (state, { payload: { tokenAddress, chartData } }) => {
      state.byAddress[tokenAddress] = { ...state.byAddress[tokenAddress], chartData }
    })
    // update historical price volume based on interval size
    .addCase(updatePriceData, (state, { payload: { tokenAddress, secondsInterval, priceData } }) => {
      state.byAddress[tokenAddress] = {
        ...state.byAddress[tokenAddress],
        priceData: {
          ...state.byAddress[tokenAddress].priceData,
          [secondsInterval]: priceData,
        },
      }
    })
)
