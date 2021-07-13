import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'
import Logo from '../Logo'
// import { useOptimismList } from 'state/lists/hooks'

export const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.text4};
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
  // const lists = useOptimismList()

  const srcs: string[] = useMemo(() => {
    const checkSummed = isAddress(address)

    if (checkSummed) {
      return [getTokenLogoURL(checkSummed)]
    }
    return []
  }, [address])

  return <StyledLogo size={size} srcs={srcs} alt={'token logo'} style={style} {...rest} />
}
