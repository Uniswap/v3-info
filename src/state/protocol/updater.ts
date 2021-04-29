import { useProtocolData, useProtocolChartData } from './hooks'
import { useEffect } from 'react'
import { useFetchProtocolData } from 'data/global/overview'
import { useFetchGlobalChartData } from 'data/global/chart'

export default function Updater(): null {
  const [protocolData, updateProtocolData] = useProtocolData()
  const { data: fetchedProtocolData, error, loading } = useFetchProtocolData()

  const [chartData, updateChartData] = useProtocolChartData()
  const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData()

  // update overview data if available and not set
  useEffect(() => {
    if (protocolData === undefined && fetchedProtocolData && !loading && !error) {
      updateProtocolData(fetchedProtocolData)
    }
  }, [error, fetchedProtocolData, loading, protocolData, updateProtocolData])

  // update global chart data if available and not set
  useEffect(() => {
    if (chartData === undefined && fetchedChartData && !chartError) {
      updateChartData(fetchedChartData)
    }
  }, [chartData, chartError, fetchedChartData, updateChartData])

  return null
}
