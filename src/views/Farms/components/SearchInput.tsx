import React from 'react'
import { Input, SearchIcon } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  border-radius: 1rem;
  padding-right: 5rem;
  width: 100%;
`

const Container = styled.div`
  width: 20rem;
  position: relative;
`

const SearchButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translate(0px, -50%);
  display: flex;
  align-items: center;
  cursor: pointer;
`
const Label = styled.span`
  margin-right: 0.375rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: 600;
`

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FunctionComponent<Props> = ({ value, onChange }) => {
  return (
    <Container>
      <StyledInput value={value} onChange={onChange} placeholder="Search farms" />
      <SearchButton type="button">
        <Label>Search</Label>
        <SearchIcon color="primary" />
      </SearchButton>
    </Container>
  )
}

export default SearchInput
