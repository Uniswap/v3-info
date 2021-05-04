import { createAction } from '@reduxjs/toolkit'
import { PoolData, PoolChartEntry } from './reducer'
import { Transaction } from 'types'

// protocol wide info
export const updatePoolData = createAction<{ pools: PoolData[] }>('pools/updatePoolData')

// add pool address to byAddress
export const addPoolKeys = createAction<{ poolAddresses: string[] }>('pool/addPoolKeys')

export const updatePoolChartData = createAction<{ poolAddress: string; chartData: PoolChartEntry[] }>(
  'pool/updatePoolChartData'
)

export const updatePoolTransactions = createAction<{ poolAddress: string; transactions: Transaction[] }>(
  'pool/updatePoolTransactions'
)
