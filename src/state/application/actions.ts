import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { NetworkInfo } from 'constants/networks'

export type PopupContent = {
  listUpdate: {
    listUrl: string
    oldList: TokenList
    newList: TokenList
    auto: boolean
  }
}

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  MENU,
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup',
)
export const removePopup = createAction<{ key: string }>('application/removePopup')
export const updateSubgraphStatus = createAction<{
  available: boolean | null
  syncedBlock: number | undefined
  headBlock: number | undefined
}>('application/updateSubgraphStatus')
export const updateActiveNetworkVersion = createAction<{ activeNetworkVersion: NetworkInfo }>(
  'application/updateActiveNetworkVersion',
)
