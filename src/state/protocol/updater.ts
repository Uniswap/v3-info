import { useProtocolData } from './hooks'
import { useEffect } from 'react'
import { fetchProtocolData } from 'data/protocol'

export default function Updater(): null {
  const [protocolData, updateProtocolData] = useProtocolData()

  console.log(protocolData)

  useEffect(() => {
    if (protocolData === undefined) {
      console.log('fetching new stuff')
      const newData = fetchProtocolData()
      updateProtocolData(newData)
    }
  }, [protocolData, updateProtocolData])

  return null
}
