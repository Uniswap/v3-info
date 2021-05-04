import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateMatchesDarkMode,
  updateUserDarkMode,
  toggleURLWarning,
  addSavedToken,
  addSavedPool,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  matchesDarkMode: boolean // whether the dark mode media query matches

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  savedTokens: string[]
  savedPools: string[]

  timestamp: number
  URLWarningVisible: boolean
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  userDarkMode: true,
  matchesDarkMode: false,
  tokens: {},
  pairs: {},
  savedTokens: [],
  savedPools: [],
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSavedToken, (state, { payload: { address } }) => {
      if (!state.savedTokens || !state.savedTokens.includes(address)) {
        const newTokens = state.savedTokens ?? []
        newTokens.push(address)
        state.savedTokens = newTokens
      }
      // toggle for delete
      else if (state.savedTokens && state.savedTokens.includes(address)) {
        const newTokens = state.savedTokens.filter((x) => x !== address)
        state.savedTokens = newTokens
      }
    })
    .addCase(addSavedPool, (state, { payload: { address } }) => {
      if (!state.savedPools || !state.savedPools.includes(address)) {
        const newPools = state.savedPools ?? []
        newPools.push(address)
        state.savedPools = newPools
      } else if (state.savedPools && state.savedPools.includes(address)) {
        const newPools = state.savedPools.filter((x) => x !== address)
        state.savedPools = newPools
      }
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible
    })
)
