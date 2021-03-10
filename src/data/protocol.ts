import { ProtocolData } from './../state/protocol/reducer'

// mocked
export function fetchProtocolData(): ProtocolData {
  return {
    volumeUSD: 12330000,
    volumeUSDChange: 3,
    liquidityUSD: 32980000000,
    liquidityUSDChange: 5,
    txnCount: 90,
    txnCountChange: -2,
  }
}
