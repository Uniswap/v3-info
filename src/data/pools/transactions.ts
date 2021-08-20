import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import gql from 'graphql-tag'
import { Transaction, TransactionType } from 'types'
import { formatTokenSymbol } from 'utils/tokens'

const POOL_TRANSACTIONS = gql`
  query transactions($address: Bytes!) {
    mints(first: 100, orderBy: timestamp, orderDirection: desc, where: { pool: $address }, subgraphError: allow) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      sender
      origin
      amount0
      amount1
      amountUSD
    }
    swaps(first: 100, orderBy: timestamp, orderDirection: desc, where: { pool: $address }, subgraphError: allow) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      origin
      amount0
      amount1
      amountUSD
    }
    burns(first: 100, orderBy: timestamp, orderDirection: desc, where: { pool: $address }, subgraphError: allow) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      amount0
      amount1
      amountUSD
    }
  }
`

interface TransactionResults {
  mints: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swaps: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burns: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    owner: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
}

export async function fetchPoolTransactions(
  address: string,
  client: ApolloClient<NormalizedCacheObject>
): Promise<{ data: Transaction[] | undefined; error: boolean; loading: boolean }> {
  const { data, error, loading } = await client.query<TransactionResults>({
    query: POOL_TRANSACTIONS,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  })

  if (error) {
    return {
      data: undefined,
      error: true,
      loading: false,
    }
  }

  if (loading && !data) {
    return {
      data: undefined,
      error: false,
      loading: true,
    }
  }

  const mints = data.mints.map((m) => {
    return {
      type: TransactionType.MINT,
      hash: m.transaction.id,
      timestamp: m.timestamp,
      sender: m.origin,
      token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
      token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
      token0Address: m.pool.token0.id,
      token1Address: m.pool.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0),
      amountToken1: parseFloat(m.amount1),
    }
  })
  const burns = data.burns.map((m) => {
    return {
      type: TransactionType.BURN,
      hash: m.transaction.id,
      timestamp: m.timestamp,
      sender: m.owner,
      token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
      token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
      token0Address: m.pool.token0.id,
      token1Address: m.pool.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0),
      amountToken1: parseFloat(m.amount1),
    }
  })

  const swaps = data.swaps.map((m) => {
    return {
      type: TransactionType.SWAP,
      hash: m.transaction.id,
      timestamp: m.timestamp,
      sender: m.origin,
      token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
      token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
      token0Address: m.pool.token0.id,
      token1Address: m.pool.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0),
      amountToken1: parseFloat(m.amount1),
    }
  })

  return { data: [...mints, ...burns, ...swaps], error: false, loading: false }
}
