import { updateProtocolData } from './actions'
import { AppState, AppDispatch } from './../index'
import { ProtocolData } from './reducer'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function useProtocolData(): [ProtocolData | undefined, (protocolData: ProtocolData) => void] {
  const protocolData: ProtocolData | undefined = useSelector((state: AppState) => state.protocol.data)

  const dispatch = useDispatch<AppDispatch>()
  const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
    (protocolData: ProtocolData) => dispatch(updateProtocolData({ protocolData })),
    [dispatch]
  )

  return [protocolData, setProtocolData]
}
