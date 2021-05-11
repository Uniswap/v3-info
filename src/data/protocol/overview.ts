import { getPercentChange } from '../../utils/data'
import { ProtocolData } from '../../state/protocol/reducer'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useDeltaTimestamps } from 'utils/queries'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useMemo } from 'react'

export const GLOBAL_DATA = (block?: string) => {
  const queryString = ` query uniswapFactories {
      factories(
       ${block ? `block: { number: ${block}}` : ``} 
       first: 1) {
        txCount
        totalVolumeUSD
        totalValueLockedUSD
      }
    }`
  return gql(queryString)
}

interface GlobalResponse {
  factories: {
    txCount: string
    totalVolumeUSD: string
    totalValueLockedUSD: string
  }[]
}

export const OFFSET_QUERY = gql`
  query pools {
    pools(where: { id: "0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248" }) {
      totalValueLockedUSD
    }
  }
`

// mocked
export function useFetchProtocolData(): {
  loading: boolean
  error: boolean
  data: ProtocolData | undefined
} {
  // get blocks from historic timestamps
  const [t24, t48] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []

  // fetch all data
  const { loading, error, data } = useQuery<GlobalResponse>(GLOBAL_DATA())
  const { loading: loading24, error: error24, data: data24 } = useQuery<GlobalResponse>(
    GLOBAL_DATA(block24?.number ?? undefined)
  )
  const { loading: loading48, error: error48, data: data48 } = useQuery<GlobalResponse>(
    GLOBAL_DATA(block48?.number ?? undefined)
  )

  // offset data
  const { loading: loadingOffset, error: errorOffset, data: dataOffset } = useQuery(OFFSET_QUERY)

  const anyError = Boolean(error || error24 || error48 || errorOffset || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48 || loadingOffset)

  const parsed = data?.factories?.[0]
  const parsed24 = data24?.factories?.[0]
  const parsed48 = data48?.factories?.[0]
  // const offsetParsed = dataOffset?.pools?.[0]

  const formattedData: ProtocolData | undefined = useMemo(() => {
    if (anyError || anyLoading || !parsed || !blocks) {
      return undefined
    }

    // volume data
    const volumeUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalVolumeUSD) - parseFloat(parsed24.totalVolumeUSD)
        : parseFloat(parsed.totalVolumeUSD)

    const volumeUSDChange =
      parsed && parsed24 && parsed48 && volumeUSD
        ? (volumeUSD / (parseFloat(parsed24.totalVolumeUSD) - parseFloat(parsed48.totalVolumeUSD))) * 100
        : 0

    // total value locked
    const tvlUSDChange = getPercentChange(parsed?.totalValueLockedUSD, parsed24?.totalValueLockedUSD)

    // 24H transactions
    const txCount =
      parsed && parsed24 ? parseFloat(parsed.txCount) - parseFloat(parsed24.txCount) : parseFloat(parsed.txCount)

    const txCountChange = getPercentChange(parsed.txCount, parsed24?.txCount)

    return {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      tvlUSD: 565200000,
      tvlUSDChange: 2.11,
      txCount,
      txCountChange,
    }
  }, [anyError, anyLoading, blocks, parsed, parsed24, parsed48])

  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  }
}
