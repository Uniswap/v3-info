import React from 'react'
import styled from 'styled-components'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { TYPE, ExternalLink } from 'theme'

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
  return (
    <Wrapper>
      <RowBetween>
        <AutoRow gap="6px">
          <RowFixed>
            <Item>ETH Price:</Item>
            <Item fontWeight="700" ml="4px">
              $1565.32
            </Item>
          </RowFixed>
          <RowFixed>
            <Item>ETH Price:</Item>
            <Item fontWeight="500" ml="4px">
              $1565.32
            </Item>
          </RowFixed>
          <RowFixed>
            <Item>ETH Price:</Item>
            <Item fontWeight="500" ml="4px">
              $1565.32
            </Item>
          </RowFixed>
        </AutoRow>
        <AutoRow gap="6px" style={{ justifyContent: 'flex-end' }}>
          <StyledLink href="">V2 Analytics</StyledLink>
          <StyledLink href="">Docs</StyledLink>
          <StyledLink href="">Discord</StyledLink>
          <StyledLink href="">App</StyledLink>
        </AutoRow>
      </RowBetween>
    </Wrapper>
  )
}

export default TopBar
