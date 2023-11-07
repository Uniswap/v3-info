import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ChainId, Currency, CurrencyAmount, Fraction, Percent, Token } from '@uniswap/sdk-core'

import JSBI from 'jsbi'
import { TokenAddressMap } from '../state/lists/hooks'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const BLOCK_EXPLORER_PREFIXES: { [chainId: number]: string } = {
  [ChainId.MAINNET]: 'https://etherscan.io',
  [ChainId.GOERLI]: 'https://goerli.etherscan.io',
  [ChainId.SEPOLIA]: 'https://sepolia.etherscan.io',
  [ChainId.ARBITRUM_ONE]: 'https://arbiscan.io',
  [ChainId.ARBITRUM_GOERLI]: 'https://goerli.arbiscan.io',
  [ChainId.OPTIMISM]: 'https://optimistic.etherscan.io',
  [ChainId.OPTIMISM_GOERLI]: 'https://goerli-optimism.etherscan.io',
  [ChainId.POLYGON]: 'https://polygonscan.com',
  [ChainId.POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
  [ChainId.CELO]: 'https://celoscan.io',
  [ChainId.CELO_ALFAJORES]: 'https://alfajores-blockscout.celo-testnet.org',
  [ChainId.BNB]: 'https://bscscan.com',
  [ChainId.AVALANCHE]: 'https://snowtrace.io',
  [ChainId.BASE]: 'https://basescan.org',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
  NATIVE = 'native',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  const prefix = BLOCK_EXPLORER_PREFIXES[chainId] ?? 'https://etherscan.io'

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}

export const currentTimestamp = () => new Date().getTime()

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

const ONE = new Fraction(1, 1)
export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: Percent): [JSBI, JSBI] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE)) throw new Error('Unexpected slippage')
  return [value.multiply(ONE.subtract(slippage)).quotient, value.multiply(ONE.add(slippage)).quotient]
}
// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
  return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address])
}

export function feeTierPercent(fee: number): string {
  return (fee / 10000).toPrecision(1) + '%'
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
