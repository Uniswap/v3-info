import { ProtocolData } from './../state/protocol/reducer'

// mocked
export function fetchProtocolData(): ProtocolData {
  return {
    usdVolume: 100,
    usdVolumeChange: 3,
    liquidityUsd: 100,
    liquidityChange: 5,
    txnCount: 90,
    txnCountChange: -2,
  }
}
