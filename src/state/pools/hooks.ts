import { addPoolKeys } from 'state/pools/actions'
import { AppState, AppDispatch } from './../index'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PoolData } from './reducer'
import { updatePoolData } from './actions'
import { notEmpty } from 'utils'

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
