import { SupportedNetwork } from 'constants/networks'
import { fetchPoolChartData } from 'data/pools/chartData'
import { usePoolDatas } from 'data/pools/poolData'
import { useTopPoolAddresses } from 'data/pools/topPools'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { useDataClient } from 'state/application/hooks'
import { updatePoolChartData } from 'state/pools/actions'
import { PoolChartEntry, PoolData } from 'state/pools/reducer'
import { ChartDayData } from 'types'
import { POOL_HIDE } from '../../constants'

/**
 * Calculates offset amount to avoid inaccurate USD data for global TVL.
 * @returns TVL value in USD
 */
export function useTVLOffset() {
  const { data } = usePoolDatas(POOL_HIDE)
  const tvlOffset = useMemo(() => {
    if (!data) return 0
    return Object.keys(data).reduce((accum: number, poolAddress) => {
      const poolData: PoolData = data[poolAddress]
      return accum + poolData.tvlUSD
    }, 0)
  }, [data])
  return tvlOffset
}

/**
 * Fecthes and formats data for pools that result in incorrect USD TVL.
 *
 * Note: not used currently but useful for debugging.
 *
 * @returns Chart data by day for values to offset accurate USD.
 */
export function useDerivedOffsetTVLHistory() {
  const dataClient = useDataClient()
  const [chartData, setChartData] = useState<{ [key: number]: ChartDayData } | undefined>(undefined)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    async function fetchAll() {
      // fetch all data for each pool
      const data = await POOL_HIDE.reduce(async (accumP: Promise<{ [key: number]: ChartDayData }>, address) => {
        const accum = await accumP
        const { data } = await fetchPoolChartData(address, dataClient)
        if (!data) return accum
        dispatch(updatePoolChartData({ poolAddress: address, chartData: data, networkId: SupportedNetwork.ETHEREUM }))
        data.map((poolDayData: PoolChartEntry) => {
          const { date, totalValueLockedUSD, volumeUSD } = poolDayData
          const roundedDate = date
          if (!accum[roundedDate]) {
            accum[roundedDate] = {
              tvlUSD: 0,
              date: roundedDate,
              volumeUSD: 0,
            }
          }
          accum[roundedDate].tvlUSD = accum[roundedDate].tvlUSD + totalValueLockedUSD
          accum[roundedDate].volumeUSD = accum[roundedDate].volumeUSD + volumeUSD
        })
        return accum
      }, Promise.resolve({} as { [key: number]: ChartDayData }))

      // Format as array
      setChartData(data)
    }

    if (!chartData) {
      fetchAll()
    }
  }, [chartData, dataClient, dispatch])

  return chartData
}

// # of pools to include in historical chart volume and TVL data
const PoolCountAggregate = 20

/**
 * Derives historical TVL data for top 50 pools.
 * @returns Chart data for aggregate Uniswap TVL over time.
 */
export function useDerivedProtocolTVLHistory() {
  const dataClient = useDataClient()
  const { addresses } = useTopPoolAddresses()
  const dispatch = useDispatch<AppDispatch>()

  const [chartData, setChartData] = useState<ChartDayData[] | undefined>(undefined)

  useEffect(() => {
    async function fetchAll() {
      if (!addresses) {
        return
      }
      // fetch all data for each pool
      const data = await addresses
        .slice(0, PoolCountAggregate) // @TODO: must be replaced with aggregate with subgraph data fixed.
        .reduce(async (accumP: Promise<{ [key: number]: ChartDayData }>, address) => {
          const accum = await accumP
          if (POOL_HIDE.includes(address)) {
            return accum
          }
          const { data } = await fetchPoolChartData(address, dataClient)
          if (!data) return accum
          dispatch(updatePoolChartData({ poolAddress: address, chartData: data, networkId: SupportedNetwork.ETHEREUM }))
          data.map((poolDayData: PoolChartEntry) => {
            const { date, totalValueLockedUSD, volumeUSD } = poolDayData
            const roundedDate = date
            if (!accum[roundedDate]) {
              accum[roundedDate] = {
                tvlUSD: 0,
                date: roundedDate,
                volumeUSD: 0,
              }
            }
            accum[roundedDate].tvlUSD = accum[roundedDate].tvlUSD + totalValueLockedUSD
            accum[roundedDate].volumeUSD = accum[roundedDate].volumeUSD + volumeUSD
          })
          return accum
        }, Promise.resolve({} as { [key: number]: ChartDayData }))

      // Format as array
      setChartData(Object.values(data))
    }

    if (!chartData) {
      fetchAll()
    }
  }, [addresses, chartData, dataClient, dispatch])

  return chartData
}
