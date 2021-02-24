import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text } from '@pancakeswap-libs/uikit'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
`

const DropDownListContainer = styled.div`
  min-width: 168px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${(props) => props.theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  background: ${(props) => props.theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  box-shadow: ${({ isOpen, theme }) => (isOpen ? theme.tooltip.boxShadow : theme.shadows.inset)};
  width: ${({ width }) => width}px;
  border-radius: ${({ isOpen }) => (isOpen ? '16px 16px 0 0' : '16px')};
  position: relative;

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
      }

      ${DropDownListContainer} {
        height: auto;
        border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        margin-left: -1px;
        border-radius: 0 0 16px 16px;
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
  padding: 6px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

const Container = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  > div {
    transform: translateY(-20px);
    padding-top: 20px;
    position: absolute;
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
}

export interface OptionProps {
  label: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({ options, onChange }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (option: OptionProps) => () => {
    setSelectedOption(option)
    setIsOpen(false)

    if (onChange) {
      onChange(option)
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
      <DropDownHeader onClick={toggling}>
        <Text>{selectedOption.label}</Text>
        <ArrowDropDownIcon color="text" />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option) =>
            option.label !== selectedOption.label ? (
              <ListItem onClick={onOptionClicked(option)} key={option.label}>
                <Text>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
