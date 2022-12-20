import { getPercentChange } from '../../utils/data'
import { ProtocolData } from '../../state/protocol/reducer'
import gql from 'graphql-tag'
import { useQuery, ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useDeltaTimestamps } from 'utils/queries'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useMemo } from 'react'
import { useClients } from 'state/application/hooks'
import { useTVLOffset } from './derived'

export const GLOBAL_DATA = (block?: string) => {
  const queryString = ` query uniswapFactories {
      factories(
       ${block !== undefined ? `block: { number: ${block}}` : ``} 
       first: 1, subgraphError: allow) {
        txCount
        totalVolumeUSD
        totalFeesUSD
        totalValueLockedUSD
      }
    }`
  return gql(queryString)
}

interface GlobalResponse {
  factories: {
    txCount: string
    totalVolumeUSD: string
    totalFeesUSD: string
    totalValueLockedUSD: string
  }[]
}

export function useFetchProtocolData(
  dataClientOverride?: ApolloClient<NormalizedCacheObject>,
  blockClientOverride?: ApolloClient<NormalizedCacheObject>
): {
  loading: boolean
  error: boolean
  data: ProtocolData | undefined
} {
  // get appropriate clients if override needed
  const { dataClient, blockClient } = useClients()
  const activeDataClient = dataClientOverride ?? dataClient
  const activeBlockClient = blockClientOverride ?? blockClient

  // Aggregate TVL in inaccurate pools. Offset Uniswap aggregate TVL by this amount.
  const tvlOffset = useTVLOffset()

  // get blocks from historic timestamps
  const [t24, t48] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48], activeBlockClient)
  const [block24, block48] = blocks ?? []

  // fetch all data
  const { loading, error, data } = useQuery<GlobalResponse>(GLOBAL_DATA(), { client: activeDataClient })

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<GlobalResponse>(GLOBAL_DATA(block24?.number ?? 0), { client: activeDataClient })

  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<GlobalResponse>(GLOBAL_DATA(block48?.number ?? 0), { client: activeDataClient })

  const anyError = Boolean(error || error24 || error48 || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48)

  const parsed = data?.factories?.[0]
  const parsed24 = data24?.factories?.[0]
  const parsed48 = data48?.factories?.[0]

  const formattedData: ProtocolData | undefined = useMemo(() => {
    if (anyError || anyLoading || !parsed || !blocks || tvlOffset === undefined) {
      return undefined
    }

    // volume data
    const volumeUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalVolumeUSD) - parseFloat(parsed24.totalVolumeUSD)
        : parseFloat(parsed.totalVolumeUSD)

    const volumeOneWindowAgo =
      parsed24?.totalVolumeUSD && parsed48?.totalVolumeUSD
        ? parseFloat(parsed24.totalVolumeUSD) - parseFloat(parsed48.totalVolumeUSD)
        : undefined

    const volumeUSDChange =
      volumeUSD && volumeOneWindowAgo ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100 : 0

    // total value locked
    const tvlUSDChange = getPercentChange(parsed?.totalValueLockedUSD, parsed24?.totalValueLockedUSD)

    // 24H transactions
    const txCount =
      parsed && parsed24 ? parseFloat(parsed.txCount) - parseFloat(parsed24.txCount) : parseFloat(parsed.txCount)

    const txCountOneWindowAgo =
      parsed24 && parsed48 ? parseFloat(parsed24.txCount) - parseFloat(parsed48.txCount) : undefined

    const txCountChange =
      txCount && txCountOneWindowAgo ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0

    const feesOneWindowAgo =
      parsed24 && parsed48 ? parseFloat(parsed24.totalFeesUSD) - parseFloat(parsed48.totalFeesUSD) : undefined

    const feesUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalFeesUSD) - parseFloat(parsed24.totalFeesUSD)
        : parseFloat(parsed.totalFeesUSD)

    const feeChange =
      feesUSD && feesOneWindowAgo ? getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0

    return {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      tvlUSD: parseFloat(parsed?.totalValueLockedUSD) - tvlOffset,
      tvlUSDChange,
      feesUSD,
      feeChange,
      txCount,
      txCountChange,
    }
  }, [anyError, anyLoading, blocks, parsed, parsed24, parsed48, tvlOffset])
  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  }
}
