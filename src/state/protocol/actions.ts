import { createAction } from '@reduxjs/toolkit'

// protocol wide
export const updateProtocolData = createAction<{ data: string }>('application/updateBlockNumber')
export const updateProtocolChartData = createAction<string>('data/protocolChart')
