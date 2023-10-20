import { BigNumber } from '@ethersproject/bignumber'
import { Connector } from '@web3-react/types'
import ms from 'ms'

import { SupportedNetwork } from './networks'

export const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

export const MATIC_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
export const CELO_ADDRESS = '0x471EcE3750Da237f93B8E339c536989b8978a438'

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const ARBITRUM_WETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'

export const WETH_ADDRESSES = [WETH_ADDRESS, ARBITRUM_WETH_ADDRESS]

export const TOKEN_HIDE: { [key: string]: string[] } = {
  [SupportedNetwork.ETHEREUM]: [
    '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    '0x7dfb72a2aad08c937706f21421b15bfc34cba9ca',
    '0x12b32f10a499bf40db334efe04226cca00bf2d9b',
    '0x160de4468586b6b2f8a92feb0c260fc6cfc743b1',
  ],
  [SupportedNetwork.POLYGON]: ['0x8d52c2d70a7c28a9daac2ff12ad9bfbf041cd318'],
  [SupportedNetwork.ARBITRUM]: [],
  [SupportedNetwork.OPTIMISM]: [],
  [SupportedNetwork.CELO]: [],
  [SupportedNetwork.BNB]: [],
  [SupportedNetwork.AVALANCHE]: [],
  [SupportedNetwork.BASE]: [],
}

export const POOL_HIDE: { [key: string]: string[] } = {
  [SupportedNetwork.ETHEREUM]: [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248',
    '0xa850478adaace4c08fc61de44d8cf3b64f359bec',
    '0x277667eb3e34f134adf870be9550e9f323d0dc24',
    '0x8c0411f2ad5470a66cb2e9c64536cfb8dcd54d51',
    '0x055284a4ca6532ecc219ac06b577d540c686669d',
  ],
  [SupportedNetwork.POLYGON]: ['0x5f616541c801e2b9556027076b730e0197974f6a'],
  [SupportedNetwork.ARBITRUM]: [],
  [SupportedNetwork.OPTIMISM]: [],
  [SupportedNetwork.CELO]: [],
  [SupportedNetwork.BNB]: [],
  [SupportedNetwork.AVALANCHE]: [],
  [SupportedNetwork.BASE]: [],
}

export const START_BLOCKS: { [key: string]: number } = {
  [SupportedNetwork.ETHEREUM]: 14292820,
  [SupportedNetwork.POLYGON]: 25459720,
  [SupportedNetwork.ARBITRUM]: 175,
  [SupportedNetwork.OPTIMISM]: 10028767,
  [SupportedNetwork.CELO]: 13916355,
  [SupportedNetwork.BNB]: 26324014,
  [SupportedNetwork.AVALANCHE]: 31422450,
  [SupportedNetwork.BASE]: 1371680,
}

export interface WalletInfo {
  connector?: Connector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const AVERAGE_L1_BLOCK_TIME = ms(`12s`)

export const NetworkContextName = 'NETWORK'

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
]
