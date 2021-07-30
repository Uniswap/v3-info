import { createReducer, nanoid } from '@reduxjs/toolkit'
import { NetworkInfo } from 'constants/networks'
import {
  addPopup,
  PopupContent,
  removePopup,
  updateBlockNumber,
  updateSubgraphStatus,
  ApplicationModal,
  setOpenModal,
  updateActiveNetworkVersion,
} from './actions'
import { EthereumNetworkInfo } from '../../constants/networks'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly subgraphStatus: {
    available: boolean | null
    syncedBlock: number | undefined
    headBlock: number | undefined
  }
  readonly activeNetworkVersion: NetworkInfo
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  subgraphStatus: {
    available: null,
    syncedBlock: undefined,
    headBlock: undefined,
  },
  activeNetworkVersion: EthereumNetworkInfo,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
    .addCase(updateSubgraphStatus, (state, { payload: { available, syncedBlock, headBlock } }) => {
      state.subgraphStatus = {
        available,
        syncedBlock,
        headBlock,
      }
    })
    .addCase(updateActiveNetworkVersion, (state, { payload: { activeNetworkVersion } }) => {
      state.activeNetworkVersion = activeNetworkVersion
    })
)
