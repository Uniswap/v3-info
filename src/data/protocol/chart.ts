import { ChartDayData } from '../../types/index'
import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gql from 'graphql-tag'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useActiveNetworkVersion, useClients } from 'state/application/hooks'
import { arbitrumClient, optimismClient } from 'apollo/client'
import { EthereumNetworkInfo } from 'constants/networks'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)
const ONE_DAY_UNIX = 24 * 60 * 60

const GLOBAL_CHART = gql`
  query uniswapDayDatas($startTime: Int!, $skip: Int!) {
    uniswapDayDatas(
      first: 1000
      skip: $skip
      subgraphError: allow
      where: { date_gt: $startTime }
      orderBy: date
      orderDirection: asc
    ) {
      id
      date
      volumeUSD
      tvlUSD
    }
  }
`

interface ChartResults {
  uniswapDayDatas: {
    date: number
    volumeUSD: string
    tvlUSD: string
  }[]
}

async function fetchChartData(client: ApolloClient<NormalizedCacheObject>) {
  let data: {
    date: number
    volumeUSD: string
    tvlUSD: string
  }[] = []
  const startTimestamp = client === arbitrumClient ? 1630423606 : client === optimismClient ? 1636697130 : 1619170975
  const endTimestamp = dayjs.utc().unix()

  let error = false
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      const { data: chartResData, error, loading } = await client.query<ChartResults>({
        query: GLOBAL_CHART,
        variables: {
          startTime: startTimestamp,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      if (!loading) {
        skip += 1000
        if (chartResData.uniswapDayDatas.length < 1000 || error) {
          allFound = true
        }
        if (chartResData) {
          data = data.concat(chartResData.uniswapDayDatas)
        }
      }
    }
  } catch {
    error = true
  }

  if (data) {
    const formattedExisting = data.reduce((accum: { [date: number]: ChartDayData }, dayData) => {
      const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
      accum[roundedDate] = {
        date: dayData.date,
        volumeUSD: parseFloat(dayData.volumeUSD),
        tvlUSD: parseFloat(dayData.tvlUSD),
      }
      return accum
    }, {})

    const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])]

    // fill in empty days ( there will be no day datas if no trades made that day )
    let timestamp = firstEntry?.date ?? startTimestamp
    let latestTvl = firstEntry?.tvlUSD ?? 0
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      const nextDay = timestamp + ONE_DAY_UNIX
      const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0))
      if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
        formattedExisting[currentDayIndex] = {
          date: nextDay,
          volumeUSD: 0,
          tvlUSD: latestTvl,
        }
      } else {
        latestTvl = formattedExisting[currentDayIndex].tvlUSD
      }
      timestamp = nextDay
    }

    if (client === optimismClient) {
      formattedExisting[18855] = {
        ...formattedExisting[18855],
        tvlUSD: 13480000,
      }
      formattedExisting[18856] = {
        ...formattedExisting[18856],
        tvlUSD: 13480000,
      }
    }

    return {
      data: Object.values(formattedExisting),
      error: false,
    }
  } else {
    return {
      data: undefined,
      error,
    }
  }
}

function useAdjustedData(indexedData: ChartDayData[] | undefined): ChartDayData[] | undefined {
  const formattedData = useMemo(() => {
    if (indexedData) {
      return indexedData.map((dayData) => {
        const adjustedData = {
          ...dayData,
          volumeUSD: dayData.volumeUSD,
          tvlUSD: dayData.tvlUSD,
        }
        return adjustedData
      })
    } else {
      return undefined
    }
  }, [indexedData])

  return formattedData
}

/**
 * Fetch historic chart data
 */
export function useFetchGlobalChartData(): {
  error: boolean
  data: ChartDayData[] | undefined
} {
  const [data, setData] = useState<{ [network: string]: ChartDayData[] | undefined }>()
  const [error, setError] = useState(false)
  const { dataClient } = useClients()

  const [activeNetworkVersion] = useActiveNetworkVersion()
  const onEthereum = activeNetworkVersion === EthereumNetworkInfo
  const indexedData = data?.[activeNetworkVersion.id]

  // @TODO: remove this once we have fix for mainnet TVL issue
  const adjustedData = useAdjustedData(indexedData)
  const formattedData = onEthereum ? adjustedData : indexedData

  useEffect(() => {
    async function fetch() {
      const { data, error } = await fetchChartData(dataClient)
      if (data && !error) {
        setData({
          [activeNetworkVersion.id]: data,
        })
      } else if (error) {
        setError(true)
      }
    }
    if (!indexedData && !error) {
      fetch()
    }
  }, [data, error, dataClient, indexedData, activeNetworkVersion.id])

  return {
    error,
    data: formattedData,
  }
}
