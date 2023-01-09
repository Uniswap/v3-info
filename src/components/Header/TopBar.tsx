import React from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ExternalLink, TYPE } from 'theme'
import { useEthPrices } from 'hooks/useEthPrices'
import { formatDollarAmount } from 'utils/numbers'
import Polling from './Polling'
import { useActiveNetworkVersion } from '../../state/application/hooks'
import { SupportedNetwork } from '../../constants/networks'

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.black};
  padding: 10px 20px;
`

const Item = styled(TYPE.main)`
  font-size: 12px;
`

const StyledLink = styled(ExternalLink)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const TopBar = () => {
  const ethPrices = useEthPrices()
  const [activeNetwork] = useActiveNetworkVersion()
  let nativeAsset: string

  switch (activeNetwork.id) {
    case SupportedNetwork.CELO:
      nativeAsset = 'Celo'
      break
    default:
      nativeAsset = 'Eth'
  }

  return (
    <Wrapper>
      <RowBetween>
        <Polling />
        <AutoRow gap="6px">
          <RowFixed>
            <Item>{nativeAsset} Price:</Item>
            <Item fontWeight="700" ml="4px">
              {formatDollarAmount(ethPrices?.current)}
            </Item>
          </RowFixed>
        </AutoRow>
        <AutoRow gap="6px" style={{ justifyContent: 'flex-end' }}>
          <StyledLink href="https://v2.info.uniswap.org/#/">V2 Analytics</StyledLink>
          <StyledLink href="https://docs.uniswap.org/">Docs</StyledLink>
          <StyledLink href="https://app.uniswap.org/#/swap">App</StyledLink>
        </AutoRow>
      </RowBetween>
    </Wrapper>
  )
}

export default TopBar
