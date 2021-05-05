import { get2DayChange, getPercentChange } from '../../utils/data'
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
    pools(where: { id: "0xb2cd930798efa9b6cb042f073a2ccea5012e7abf" }) {
      totalValueLockedUSD
    }
  }
`

export const OFFSET_QUERY1 = gql`
  query pools {
    pools(where: { id: "0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee" }) {
      totalValueLockedUSD
    }
  }
`

export const OFFSET_QUERY2 = gql`
  query pools {
    pools(where: { id: "0x86d257cdb7bc9c0df10e84c8709697f92770b335" }) {
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
  const [t24, t48, tWeek] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
  const [block24, block48, blockWeek] = blocks ?? []

  // fetch all data
  const { loading, error, data } = useQuery<GlobalResponse>(GLOBAL_DATA())
  const { loading: loading24, error: error24, data: data24 } = useQuery<GlobalResponse>(GLOBAL_DATA('8482286'))
  const { loading: loading48, error: error48, data: data48 } = useQuery<GlobalResponse>(GLOBAL_DATA('8477286'))

  const anyError = Boolean(error || error24 || error48 || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48)

  const parsed = data?.factories?.[0]
  const parsed24 = data24?.factories?.[0]
  const parsed48 = data48?.factories?.[0]

  const formattedData: ProtocolData | undefined = useMemo(() => {
    if (anyError || anyLoading || !parsed) {
      return undefined
    }
    // case where hasnt existed yet
    const [volumeUSD, volumeUSDChange] =
      parsed && parsed24 && parsed48
        ? get2DayChange(parsed.totalVolumeUSD, parsed24.totalVolumeUSD, parsed48.totalVolumeUSD)
        : [parseFloat(parsed.totalVolumeUSD), 0]
    const tvlUSDChange = parsed24 ? getPercentChange(parsed.totalValueLockedUSD, parsed24.totalValueLockedUSD) : 0
    const [txCount, txCountChange] =
      parsed24 && parsed48
        ? get2DayChange(parsed.txCount, parsed24.txCount, parsed48.txCount)
        : [parseFloat(parsed.txCount), 0]

    return {
      volumeUSD: volumeUSD,
      volumeUSDChange,
      tvlUSD: 71466000,
      tvlUSDChange,
      txCount,
      txCountChange,
    }
  }, [anyError, anyLoading, parsed, parsed24, parsed48])

  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  }
}
