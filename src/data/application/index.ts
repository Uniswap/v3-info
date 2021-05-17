import { healthClient } from './../../apollo/client'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

interface HealthResponse {
  indexingStatusForCurrentVersion: {
    chains: {
      chainHeadBlock: {
        number: string
      }
      latestBlock: {
        number: string
      }
    }[]
    synced: boolean
  }
}

/**
 * Fetch top addresses by volume
 */
export function useFetchedSubgraphStatus(): {
  available: boolean | null
  syncedBlock: number | undefined
  headBlock: number | undefined
} {
  const { loading, error, data } = useQuery<HealthResponse>(SUBGRAPH_HEALTH, {
    client: healthClient,
    fetchPolicy: 'network-only',
  })

  const parsed = data?.indexingStatusForCurrentVersion

  if (loading) {
    return {
      available: null,
      syncedBlock: undefined,
      headBlock: undefined,
    }
  }

  if ((!loading && !parsed) || error) {
    return {
      available: false,
      syncedBlock: undefined,
      headBlock: undefined,
    }
  }

  const syncedBlock = parsed?.chains[0].latestBlock.number
  const headBlock = parsed?.chains[0].chainHeadBlock.number

  return {
    available: true,
    syncedBlock: syncedBlock ? parseFloat(syncedBlock) : undefined,
    headBlock: headBlock ? parseFloat(headBlock) : undefined,
  }
}
