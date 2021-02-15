import React, { useState, useRef } from 'react'
import { Input, SearchIcon, IconButton } from '@pancakeswap-libs/uikit'
import styled, { css } from 'styled-components'

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
    width: 320px;
    display: block;
  }
`

const SearchButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translate(0px, -50%);
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  transition: 0.3s;

  ${({ theme }) => theme.mediaQueries.sm} {
    opacity: 1 !important;
  }
`

const Container = styled.div<{ toggled: boolean }>`
  margin-left: auto;
  position: absolute;
  right: 0;

  ${(props) => css`
    left: ${props.toggled ? '0' : 'auto'};
    ${StyledInput} {
      width: ${props.toggled ? '100%' : '0'};
      padding: ${props.toggled ? '0 1rem' : '0'};
      opacity: ${props.toggled ? '1' : '0'};
    }

    ${SearchButton} {
      opacity: ${props.toggled ? '1' : '0'};
    }
  `}

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
  }
`

const Label = styled.span`
  margin-right: 6px;
  color: ${(props) => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
`

const MobileContainer = styled.div`
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FunctionComponent<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  const handleToggleButtonClick = (): void => {
    inputEl.current.focus()
    setToggled(true)
  }

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
        <SearchButton type="button">
          <Label>Search</Label>
          <SearchIcon color="primary" />
        </SearchButton>
      </InputWrapper>
      {!toggled && (
        <MobileContainer>
          <IconButton variant="text" size="sm" onClick={handleToggleButtonClick}>
            <SearchIcon color="primary" />
          </IconButton>
        </MobileContainer>
      )}
    </Container>
  )
}

export default SearchInput
