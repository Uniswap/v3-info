import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import lists from './lists/reducer'
import multicall from './multicall/reducer'
import protocol from './protocol/reducer'
import tokens from './tokens/reducer'
import pools from './pools/reducer'

const PERSISTED_KEYS: string[] = ['user', 'lists', 'application']

const reducers = combineReducers({
  application,
  user,
  multicall,
  lists,
  protocol,
  tokens,
  pools,
  state: (state = {}) => state,
})

export const DESTROY_SESSION = 'DESTROY_SESSION'

const rootReducer = (state: any, action: any) => {
  // Clear all uniswap data in redux store to initial.
  if (action.type === DESTROY_SESSION) state = { ...state, protocol: undefined, tokens: undefined, pools: undefined }
  return reducers(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware({ thunk: false, immutableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
