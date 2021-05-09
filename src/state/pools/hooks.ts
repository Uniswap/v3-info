import { addPoolKeys, updatePoolChartData, updatePoolTransactions, updateTickData } from 'state/pools/actions'
import { AppState, AppDispatch } from './../index'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PoolData, PoolChartEntry } from './reducer'
import { updatePoolData } from './actions'
import { notEmpty } from 'utils'
import { fetchPoolChartData } from 'data/pools/chartData'
import { Transaction } from 'types'
import { fetchPoolTransactions } from 'data/pools/transactions'
import { PoolTickData } from 'data/pools/tickData'

export function useAllPoolData(): {
  [address: string]: { data: PoolData | undefined; lastUpdated: number | undefined }
} {
  return useSelector((state: AppState) => state.pools.byAddress)
}

export function useUpdatePoolData(): (pools: PoolData[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((pools: PoolData[]) => dispatch(updatePoolData({ pools })), [dispatch])
}

export function useAddPoolKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((poolAddresses: string[]) => dispatch(addPoolKeys({ poolAddresses })), [dispatch])
}

export function usePoolDatas(poolAddresses: string[]): PoolData[] {
  const allPoolData = useAllPoolData()
  const addPoolKeys = useAddPoolKeys()

  const untrackedAddresses = poolAddresses.reduce((accum: string[], address) => {
    if (!Object.keys(allPoolData).includes(address)) {
      accum.push(address)
    }
    return accum
  }, [])

  useEffect(() => {
    if (untrackedAddresses) {
      addPoolKeys(untrackedAddresses)
    }
    return
  }, [addPoolKeys, untrackedAddresses])

  // filter for pools with data
  const poolsWithData = poolAddresses
    .map((address) => {
      const poolData = allPoolData[address]?.data
      return poolData ?? undefined
    })
    .filter(notEmpty)

  return poolsWithData
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function usePoolChartData(address: string): PoolChartEntry[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const pool = useSelector((state: AppState) => state.pools.byAddress[address])
  const chartData = pool?.chartData
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchPoolChartData(address)
      if (!error && data) {
        dispatch(updatePoolChartData({ poolAddress: address, chartData: data }))
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
 * Get all transactions on pool
 * @param address
 */
export function usePoolTransactions(address: string): Transaction[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const pool = useSelector((state: AppState) => state.pools.byAddress[address])
  const transactions = pool?.transactions
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { error, data } = await fetchPoolTransactions(address)
      if (error) {
        setError(true)
      } else if (data) {
        dispatch(updatePoolTransactions({ poolAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions])

  // return data
  return transactions
}

export function usePoolTickData(
  address: string
): [PoolTickData | undefined, (poolAddress: string, tickData: PoolTickData) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const pool = useSelector((state: AppState) => state.pools.byAddress[address])
  const tickData = pool.tickData

  const setPoolTickData = useCallback(
    (address: string, tickData: PoolTickData) => dispatch(updateTickData({ poolAddress: address, tickData })),
    [dispatch]
  )

  return [tickData, setPoolTickData]
}
