import styled from 'styled-components'
import { TYPE } from 'theme'

// responsive text
export const Label = styled(TYPE.label)<{ end?: number }>`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
  font-variant-numeric: tabular-nums;
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

export const ClickableText = styled(Label)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
`
