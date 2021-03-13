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
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  min-width: 136px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
          props.isOpen &&
          css`
            ${DropDownHeader} {
              border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
              box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
              border-radius: 16px 16px 0 0;
            }

            ${DropDownListContainer} {
              height: auto;
              transform: scaleY(1);
              opacity: 1;
              border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
              border-top-width: 0;
              border-radius: 0 0 16px 16px;
              box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
            }
          `}
  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  height: 150px;
  overflow-y: auto;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;

  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface RoundSelectProps {
  options: RoundOptionProps[]
  onChange?: (option: RoundOptionProps) => void
}

export interface RoundOptionProps {
  label: string
  value: any
}

const RoundSelect: React.FunctionComponent<RoundSelectProps> = ({ options, onChange }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (option: RoundOptionProps) => () => {
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
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling}>
          <Text>{selectedOption.label}</Text>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color='text' onClick={toggling} />
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option) =>
            <ListItem onClick={onOptionClicked(option)} key={option.label}>
              <Text>{option.label}</Text>
            </ListItem>,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default RoundSelect
