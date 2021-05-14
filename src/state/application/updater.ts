import { useEffect } from 'react'
import { useSubgraphStatus } from './hooks'
import { useFetchedSubgraphStatus } from '../../data/application'

export default function Updater(): null {
  // subgraph status
  const [status, updateStatus] = useSubgraphStatus()
  const { available } = useFetchedSubgraphStatus()

  const syncedBlock = status.syncedBlock

  useEffect(() => {
    if (status.available === null && available !== null) {
      updateStatus(available, syncedBlock)
    }
  }, [available, status.available, syncedBlock, updateStatus])

  return null
}
