import React, { useRef, useCallback, useState } from 'react'
import styled from 'styled-components'
import Row from 'components/Row'
import { TYPE } from 'theme'
import Hotkeys from 'react-hot-keys'

const Wrapper = styled(Row)`
  background-color: ${({ theme }) => theme.black};
  padding: 10px 16px;
  width: 300px;
  height: 38px;
  border-radius: 20px;
`

const StyledInput = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  width: 100%;
  font-size: 16px;
  outline: none;
  color: ${({ theme }) => theme.text1};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchSmall = ({ ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleDown = useCallback(() => {
    if (ref != null && ref.current !== null) {
      ref.current.focus()
    }
  }, [])

  const [focused, setFocused] = useState<boolean>(false)

  return (
    <Hotkeys keyName="command+/" onKeyDown={handleDown}>
      <Wrapper {...rest}>
        <StyledInput
          type="text"
          placeholder="Search pairs or tokens"
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {!focused && <TYPE.gray pl="2px">⌘/</TYPE.gray>}
      </Wrapper>
    </Hotkeys>
  )
}

export default SearchSmall
