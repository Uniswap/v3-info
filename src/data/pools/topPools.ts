import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`

interface TopPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopPoolAddresses(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const { loading, error, data } = useQuery<TopPoolsResponse>(TOP_POOLS, {
    fetchPolicy: 'network-only',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools.map((p) => p.id)
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}
