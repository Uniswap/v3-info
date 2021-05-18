import { useEffect } from 'react'
import { useSubgraphStatus } from './hooks'
import { useFetchedSubgraphStatus } from '../../data/application'

export default function Updater(): null {
  // subgraph status
  const [status, updateStatus] = useSubgraphStatus()
  const { available, syncedBlock: newSyncedBlock } = useFetchedSubgraphStatus()

  const syncedBlock = status.syncedBlock

  useEffect(() => {
    if (status.available === null && available !== null) {
      updateStatus(available, syncedBlock)
    }
    if (!status.syncedBlock || (status.syncedBlock !== newSyncedBlock && syncedBlock)) {
      updateStatus(status.available, newSyncedBlock)
    }
  }, [available, newSyncedBlock, status.available, status.syncedBlock, syncedBlock, updateStatus])

  return null
}
