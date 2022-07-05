import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  arbitrumBlockClient,
  arbitrumClient,
  blockClient,
  client,
  optimismClient,
  optimismBlockClient,
  polygonBlockClient,
  polygonClient,
  celoClient,
  celoBlockClient,
} from 'apollo/client'
import { NetworkInfo, SupportedNetwork } from 'constants/networks'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setOpenModal,
  updateActiveNetworkVersion,
  updateSubgraphStatus,
} from './actions'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter((item) => item.show), [list])
}

// returns a function that allows adding a popup
export function useSubgraphStatus(): [
  {
    available: boolean | null
    syncedBlock: number | undefined
    headBlock: number | undefined
  },
  (available: boolean | null, syncedBlock: number | undefined, headBlock: number | undefined) => void
] {
  const dispatch = useDispatch()
  const status = useSelector((state: AppState) => state.application.subgraphStatus)

  const update = useCallback(
    (available: boolean | null, syncedBlock: number | undefined, headBlock: number | undefined) => {
      dispatch(updateSubgraphStatus({ available, syncedBlock, headBlock }))
    },
    [dispatch]
  )
  return [status, update]
}

// returns a function that allows adding a popup
export function useActiveNetworkVersion(): [NetworkInfo, (activeNetworkVersion: NetworkInfo) => void] {
  const dispatch = useDispatch()
  const activeNetwork = useSelector((state: AppState) => state.application.activeNetworkVersion)
  const update = useCallback(
    (activeNetworkVersion: NetworkInfo) => {
      dispatch(updateActiveNetworkVersion({ activeNetworkVersion }))
    },
    [dispatch]
  )
  return [activeNetwork, update]
}

// get the apollo client related to the active network
export function useDataClient(): ApolloClient<NormalizedCacheObject> {
  const [activeNetwork] = useActiveNetworkVersion()
  switch (activeNetwork.id) {
    case SupportedNetwork.ETHEREUM:
      return client
    case SupportedNetwork.ARBITRUM:
      return arbitrumClient
    case SupportedNetwork.OPTIMISM:
      return optimismClient
    case SupportedNetwork.POLYGON:
      return polygonClient
    case SupportedNetwork.CELO:
      return celoClient
    default:
      return client
  }
}

// get the apollo client related to the active network for fetching blocks
export function useBlockClient(): ApolloClient<NormalizedCacheObject> {
  const [activeNetwork] = useActiveNetworkVersion()
  switch (activeNetwork.id) {
    case SupportedNetwork.ETHEREUM:
      return blockClient
    case SupportedNetwork.ARBITRUM:
      return arbitrumBlockClient
    case SupportedNetwork.OPTIMISM:
      return optimismBlockClient
    case SupportedNetwork.POLYGON:
      return polygonBlockClient
    case SupportedNetwork.CELO:
      return celoBlockClient
    default:
      return blockClient
  }
}

// Get all required subgraph clients
export function useClients(): {
  dataClient: ApolloClient<NormalizedCacheObject>
  blockClient: ApolloClient<NormalizedCacheObject>
} {
  const dataClient = useDataClient()
  const blockClient = useBlockClient()
  return {
    dataClient,
    blockClient,
  }
}
