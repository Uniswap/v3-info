import { ProtocolData } from './reducer'
import { createAction } from '@reduxjs/toolkit'

// protocol wide info
export const updateProtocolData = createAction<{ protocolData: ProtocolData }>('application/updateBlockNumber')
