import { Token } from '@uniswap/sdk-core'
import { NetworkInfo, PolygonNetworkInfo } from 'constants/networks'
import { WETH_ADDRESSES } from '../constants/index'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

export function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function formatTokenSymbol(address: string, symbol: string, activeNetwork?: NetworkInfo) {
  // dumb catch for matic
  if (address === '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' && activeNetwork === PolygonNetworkInfo) {
    return 'MATIC'
  }

  if (WETH_ADDRESSES.includes(address)) {
    return 'ETH'
  }
  return symbol
}

export function formatTokenName(address: string, name: string, activeNetwork?: NetworkInfo) {
  // dumb catch for matic
  if (address === '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' && activeNetwork === PolygonNetworkInfo) {
    return 'MATIC'
  }

  if (WETH_ADDRESSES.includes(address)) {
    return 'Ether'
  }
  return name
}
