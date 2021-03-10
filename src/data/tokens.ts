import { TokenData } from 'state/tokens/reducer'
import { Token } from '@uniswap/sdk'

// fetch top tokens based on volume, liquidity, and price change
export function fetchTopTokens(): TokenData[] {
  return [
    {
      token: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
      volumeUSD: 8900020,
      liquidityUSD: 201088200.20387,
      priceUSD: 1.01,
      priceUSDChange: 0.0001,
      priceUSDChangeWeek: 0,
    },
    {
      token: new Token(1, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uniswap'),
      volumeUSD: 76002832,
      liquidityUSD: 331088200.3839,
      priceUSD: 24.5897,
      priceUSDChange: 9.773,
      priceUSDChangeWeek: 12.37893,
    },
  ]
}
