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
  width: 10.5em;
  height: 0;
  overflow: hidden;
`

const DropDownContainer = styled.div<{ isOpen: boolean }>`
  cursor: pointer;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.input};
  border: 1px solid #d7caec;
  overflow: hidden;
  box-shadow: ${({ isOpen, theme }) =>
    isOpen ? '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px -8px rgba(14, 14, 44, 0.1)' : theme.shadows.inset};

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid #d7caec;
      }

      ${DropDownListContainer} {
        height: auto;
      }
    `}
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
`

const ListItem = styled.li`
  list-style: none;
  padding: 6px 16px;
  &:hover {
    background: #d7caec;
  }
`

const Container = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  > div {
    position: absolute;
    transform: translateY(-20px);
    padding-top: 20px;
    z-index: 5;
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
  const headerRef = useRef(null)
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
      width: headerRef.current.offsetWidth,
      height: headerRef.current.offsetHeight,
    })
  }, [])

  return (
    <Container ref={containerRef} {...containerSize}>
      <div>
        <DropDownContainer isOpen={isOpen}>
          <DropDownHeader onClick={toggling} ref={headerRef}>
            <Text>{selectedOption.label}</Text>
            <ArrowDropDownIcon />
          </DropDownHeader>
          <DropDownListContainer>
            <DropDownList>
              {options.map((option) => (
                <ListItem onClick={onOptionClicked(option)} key={option.label}>
                  <Text>{option.label}</Text>
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        </DropDownContainer>
      </div>
    </Container>
  )
}

export default Select
