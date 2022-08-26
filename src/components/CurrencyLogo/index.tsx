import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'
import Logo from '../Logo'
import { useCombinedActiveList } from 'state/lists/hooks'
import useHttpLocations from 'hooks/useHttpLocations'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { OptimismNetworkInfo } from 'constants/networks'
import EthereumLogo from '../../assets/images/ethereum-logo.png'

export const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.text4};
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export default function CurrencyLogo({
  address,
  size = '24px',
  style,
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) {
  // useOptimismList()
  const optimismList = useCombinedActiveList()?.[10]
  const arbitrumList = useCombinedActiveList()?.[42161]
  const polygon = useCombinedActiveList()?.[137]
  const celo = useCombinedActiveList()?.[42220]

  const [activeNetwork] = useActiveNetworkVersion()

  const checkSummed = isAddress(address)

  const optimismURI = useMemo(() => {
    if (checkSummed && optimismList?.[checkSummed]) {
      return optimismList?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, optimismList])
  const uriLocationsOptimism = useHttpLocations(optimismURI)

  const arbitrumURI = useMemo(() => {
    if (checkSummed && arbitrumList?.[checkSummed]) {
      return arbitrumList?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, arbitrumList])
  const uriLocationsArbitrum = useHttpLocations(arbitrumURI)

  const polygonURI = useMemo(() => {
    if (checkSummed && polygon?.[checkSummed]) {
      return polygon?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, polygon])
  const uriLocationsPolygon = useHttpLocations(polygonURI)

  const celoURI = useMemo(() => {
    if (checkSummed && celo?.[checkSummed]) {
      return celo?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, celo])
  const uriLocationsCelo = useHttpLocations(celoURI)

  //temp until token logo issue merged
  const tempSources: { [address: string]: string } = useMemo(() => {
    return {
      ['0x4dd28568d05f09b02220b09c2cb307bfd837cb95']:
        'https://assets.coingecko.com/coins/images/18143/thumb/wCPb0b88_400x400.png?1630667954',
    }
  }, [])

  const srcs: string[] = useMemo(() => {
    const checkSummed = isAddress(address)

    if (checkSummed && address) {
      const override = tempSources[address]
      return [
        getTokenLogoURL(checkSummed),
        ...uriLocationsOptimism,
        ...uriLocationsArbitrum,
        ...uriLocationsPolygon,
        ...uriLocationsCelo,
        override,
      ]
    }
    return []
  }, [address, tempSources, uriLocationsArbitrum, uriLocationsOptimism, uriLocationsPolygon, uriLocationsCelo])

  if (activeNetwork === OptimismNetworkInfo && address === '0x4200000000000000000000000000000000000006') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} {...rest} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={'token logo'} style={style} {...rest} />
}
