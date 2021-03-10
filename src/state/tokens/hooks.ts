import { AppState, AppDispatch } from './../index'
import { TokenData } from './reducer'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTokenData } from './actions'

export function useAllTokenData(): { [address: string]: { data: TokenData; lastUpdated: number } } {
  return useSelector((state: AppState) => state.tokens.byAddress)
}

export function useTopTokens(): string[] | undefined {
  return useSelector((state: AppState) => state.tokens.topTokens)
}

export function useUpdateTokenData(): (tokens: TokenData[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((tokens: TokenData[]) => dispatch(updateTokenData({ tokens })), [dispatch])
}
