import { createAction } from '@reduxjs/toolkit'
import { PoolData } from './reducer'

// protocol wide info
export const updatePoolData = createAction<{ pools: PoolData[] }>('pools/updatePoolData')

// add pool address to byAddress
export const addPoolKeys = createAction<{ poolAddresses: string[] }>('pool/addPoolKeys')
