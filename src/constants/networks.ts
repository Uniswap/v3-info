import OPTIMISM_LOGO_URL from '../assets/images/optimism.png'
import ARBITRUM_LOGO_URL from '../assets/images/arbitrum.svg'
import ETHEREUM_LOGO_URL from '../assets/images/ethereum-logo.png'

export enum SupportedNetwork {
  ETHEREUM,
  ARBITRUM,
  OPTIMISM,
}

export type NetworkInfo = {
  id: SupportedNetwork
  name: string
  imageURL: string
  blurb?: string
}

export const EthereumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ETHEREUM,
  name: 'Ethereum',
  imageURL: ETHEREUM_LOGO_URL,
}

export const ArbitrumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ARBITRUM,
  name: 'Abritrum',
  imageURL: ARBITRUM_LOGO_URL,
  blurb: 'L2 Beta',
}

export const OptimismNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.OPTIMISM,
  name: 'Optimism',
  imageURL: OPTIMISM_LOGO_URL,
}

export const SUPPORTED_NETWORK_VERSIONS: NetworkInfo[] = [EthereumNetworkInfo, ArbitrumNetworkInfo]
