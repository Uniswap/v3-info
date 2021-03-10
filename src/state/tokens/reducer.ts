import { currentTimestamp } from './../../utils/index'
import { updateTokenData } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { Token } from '@uniswap/sdk'

export interface TokenData {
  // basic token info
  token: Token

  // stats
  volumeUSD: number
  liquidityUSD: number
  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
}

export interface TokensState {
  // analytics data from
  byAddress: { [address: string]: { data: TokenData; lastUpdated: number } }

  topTokens: string[] | undefined
}

export const initialState: TokensState = { byAddress: {}, topTokens: undefined }

export default createReducer(initialState, (builder) =>
  builder.addCase(updateTokenData, (state, { payload: { tokens } }) => {
    tokens.map(
      (tokenData) => (state.byAddress[tokenData.token.address] = { data: tokenData, lastUpdated: currentTimestamp() })
    )
  })
)
