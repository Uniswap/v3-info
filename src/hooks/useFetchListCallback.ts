import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback((ensName: string) => {
    if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
      const networkLibrary = getNetworkLibrary()
      if (networkLibrary) {
        return resolveENSContentHash(ensName, networkLibrary)
      }
    }
    throw new Error('Could not construct mainnet ENS resolver')
  }, [])

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}
