import { SupportedChainId } from 'constants/chains'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [SupportedChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [SupportedChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [SupportedChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [SupportedChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [SupportedChainId.CELO]: '0x9e824152ADA7574b659585f51e7Da9BeC9F4aC74',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
