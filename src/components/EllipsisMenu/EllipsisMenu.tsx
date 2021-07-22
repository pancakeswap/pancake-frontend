import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { EllipsisIcon, Text } from '@pancakeswap/uikit'

const DropDownHeader = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  top: 70%;
  right: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.modal};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0) scaleX(0);
  transform-origin: top right;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean }>`
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  height: 40px;
  user-select: none;

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-radius: 16px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
}

export interface OptionProps {
  label: string
  value: any
  icon?: React.ReactNode
}

const EllipsisMenu: React.FC<SelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <DropDownContainer isOpen={isOpen}>
      <DropDownHeader onClick={toggling}>
        <EllipsisIcon height="16px" width="16px" />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList>
          {options.map((option, index) => (
            <ListItem onClick={onOptionClicked(index)} key={option.label}>
              <Text>{option.label}</Text>
              {option.icon ?? null}
            </ListItem>
          ))}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default EllipsisMenu
