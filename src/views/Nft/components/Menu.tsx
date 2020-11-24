import React from 'react'
import styled from 'styled-components'
import { Checkbox } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface MenuProps {
  activeFilters?: string[]
}

const StyledMenu = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding-bottom: 32px;
  padding-top: 32px;
`

const Label = styled.label`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  display: inline-flex;
  padding: 0 16px;

  span {
    margin-left: 4px;
  }
`

const Menu: React.FC<MenuProps> = ({ activeFilters }) => {
  const TranslateString = useI18n()

  return (
    <StyledMenu>
      <Label>
        <Checkbox />
        <span>{TranslateString(999, 'Your NFTs')}</span>
      </Label>
      <Label>
        <Checkbox />
        <span>{TranslateString(526, 'Available')}</span>
      </Label>
      <Label>
        <Checkbox />
        <span>{TranslateString(999, 'Unavailable')}</span>
      </Label>
    </StyledMenu>
  )
}

export default Menu
