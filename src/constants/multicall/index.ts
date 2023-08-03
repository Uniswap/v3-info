import { ChainId } from '@uniswap/sdk-core'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.AVALANCHE]: '0x0139141Cd4Ee88dF3Cdb65881D411bAE271Ef0C2',
  [ChainId.CELO]: '0x9e824152ADA7574b659585f51e7Da9BeC9F4aC74',
  [ChainId.BASE]: '0x091e99cb1C49331a94dD62755D168E941AbD0693',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
