import { useProtocolData } from './hooks'
import { useEffect } from 'react'
import { fetchProtocolData } from 'data/protocol'

export default function Updater(): null {
  const [protocolData, updateProtocolData] = useProtocolData()

  useEffect(() => {
    if (protocolData === undefined) {
      const newData = fetchProtocolData()
      updateProtocolData(newData)
    }
  }, [protocolData, updateProtocolData])

  return null
}
