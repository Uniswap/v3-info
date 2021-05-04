import { AppState, AppDispatch } from './../index'
import { TokenData, TokenChartEntry, TokenPriceEntry } from './reducer'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateTokenData,
  addTokenKeys,
  addPoolAddresses,
  updateChartData,
  updatePriceData,
  updateTransactions,
} from './actions'
import { isAddress } from 'ethers/lib/utils'
import { fetchPoolsForToken } from 'data/tokens/poolsForToken'
import { fetchTokenChartData } from 'data/tokens/chartData'
import { fetchTokenPriceData } from 'data/tokens/priceData'
import { fetchTokenTransactions } from 'data/tokens/transactions'
import { Transaction } from 'types'
import { notEmpty } from 'utils'

export function useAllTokenData(): {
  [address: string]: { data: TokenData | undefined; lastUpdated: number | undefined }
} {
  return useSelector((state: AppState) => state.tokens.byAddress)
}

export function useUpdateTokenData(): (tokens: TokenData[]) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (tokens: TokenData[]) => {
      dispatch(updateTokenData({ tokens }))
    },
    [dispatch]
  )
}

export function useAddTokenKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses })), [dispatch])
}

export function useTokenDatas(addresses: string[] | undefined): TokenData[] | undefined {
  const allTokenData = useAllTokenData()
  const addTokenKeys = useAddTokenKeys()

  // if token not tracked yet track it
  addresses?.map((a) => {
    if (!allTokenData[a]) {
      addTokenKeys([a])
    }
  })

  const data = useMemo(() => {
    if (!addresses) {
      return undefined
    }
    return addresses
      .map((a) => {
        return allTokenData[a]?.data
      })
      .filter(notEmpty)
  }, [addresses, allTokenData])

  return data
}

export function useTokenData(address: string | undefined): TokenData | undefined {
  const allTokenData = useAllTokenData()
  const addTokenKeys = useAddTokenKeys()

  // if invalid address return
  if (!address || !isAddress(address)) {
    return undefined
  }

  // if token not tracked yet track it
  if (!allTokenData[address]) {
    addTokenKeys([address])
  }

  // return data
  return allTokenData[address]?.data
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function usePoolsForToken(address: string): string[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: AppState) => state.tokens.byAddress[address])
  const poolsForToken = token.poolAddresses
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { loading, error, addresses } = await fetchPoolsForToken(address)
      if (!loading && !error && addresses) {
        dispatch(addPoolAddresses({ tokenAddress: address, poolAddresses: addresses }))
      }
      if (error) {
        setError(error)
      }
    }
    if (!poolsForToken && !error) {
      fetch()
    }
  }, [address, dispatch, error, poolsForToken])

  // return data
  return poolsForToken
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenChartData(address: string): TokenChartEntry[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: AppState) => state.tokens.byAddress[address])
  const chartData = token.chartData
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchTokenChartData(address)
      if (!error && data) {
        dispatch(updateChartData({ tokenAddress: address, chartData: data }))
      }
      if (error) {
        setError(error)
      }
    }
    if (!chartData && !error) {
      fetch()
    }
  }, [address, dispatch, error, chartData])

  // return data
  return chartData
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenPriceData(address: string, interval: number): TokenPriceEntry[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: AppState) => state.tokens.byAddress[address])
  const priceData = token.priceData[interval]
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const priceData = await fetchTokenPriceData(address, interval)

      if (priceData) {
        dispatch(
          updatePriceData({
            tokenAddress: address,
            secondsInterval: interval,
            priceData: priceData as TokenPriceEntry[],
          })
        )
      }
      if (error) {
        setError(error)
      }
    }
    if (!priceData && !error) {
      fetch()
    }
  }, [address, dispatch, error, interval, priceData])

  // return data
  return priceData
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function useTokenTransactions(address: string): Transaction[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: AppState) => state.tokens.byAddress[address])
  const transactions = token.transactions
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchTokenTransactions(address)
      if (error) {
        setError(true)
      } else if (data) {
        dispatch(updateTransactions({ tokenAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions])

  // return data
  return transactions
}
