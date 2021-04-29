import gql from 'graphql-tag'
import { client } from 'apollo/client'

export const POOLS_FOR_TOKEN = gql`
  query topPools($address: Bytes!) {
    asToken0: pools(first: 200, orderBy: totalValueLockedUSD, orderDirection: desc, where: { token0: $address }) {
      id
    }
    asToken1: pools(first: 200, orderBy: totalValueLockedUSD, orderDirection: desc, where: { token1: $address }) {
      id
    }
  }
`

interface PoolsForTokenResponse {
  asToken0: {
    id: string
  }[]
  asToken1: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolsForToken(
  address: string
): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const { loading, error, data } = await client.query<PoolsForTokenResponse>({
      query: POOLS_FOR_TOKEN,
      variables: {
        address: address,
      },
      fetchPolicy: 'cache-first',
    })

    if (loading || error || !data) {
      return {
        loading,
        error: Boolean(error),
        addresses: undefined,
      }
    }

    const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id)

    return {
      loading,
      error: Boolean(error),
      addresses: formattedData,
    }
  } catch {
    return {
      loading: false,
      error: true,
      addresses: undefined,
    }
  }
}
