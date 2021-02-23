import React, { useState, useRef } from 'react'
import { Input } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  border-radius: 16px;
  padding-right: 80px;
  transition: 0.3s;
  margin-left: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100% !important;
    padding: 0 1rem !important;
    opacity: 1 !important;
  }
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FunctionComponent<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <StyledInput
          ref={inputEl}
          value={value}
          onChange={onChange}
          placeholder="Search farms"
          onBlur={() => setToggled(false)}
        />
      </InputWrapper>
    </Container>
  )
}

export default SearchInput
