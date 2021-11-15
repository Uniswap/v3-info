export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,

  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
]
