import { ArrowDropDownIcon, Box, Checkbox, Text } from '@pancakeswap/uikit'
import { useCallback, useEffect, useState } from 'react'
import { css, styled } from 'styled-components'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 100px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;
`

const DropDownContainer = styled(Box)<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 40px;
  min-width: 125px;
  user-select: none;
  z-index: 20;

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
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  display: flex;
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }

  input {
    margin: 0 8px 0 0;
  }
`

export interface MultiSelectorProps {
  placeHolderText?: string
}

const options = [
  { id: 0, label: 'Category 1', value: 0 },
  { id: 1, label: 'Category 2', value: 1 },
  { id: 2, label: 'Category 3', value: 2 },
]

const MultiSelector: React.FunctionComponent<React.PropsWithChildren<MultiSelectorProps>> = ({
  placeHolderText,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<number>>([])

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const isCheckboxValid = useCallback((id: number) => pickMultiSelect.includes(id), [pickMultiSelect])

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)

    const hasPickedData = isCheckboxValid(id)
    if (hasPickedData) {
      const newData = pickMultiSelect.filter((i) => i !== id)
      setPickMultiSelect(newData)
    } else {
      const newData = [...pickMultiSelect, id]
      setPickMultiSelect(newData)
    }
  }

  return (
    <DropDownContainer maxWidth="188px" isOpen={isOpen}>
      <DropDownHeader onClick={toggling} {...props}>
        {pickMultiSelect.length === 0 && placeHolderText ? (
          <Text ellipsis color="text" pr="20px">
            {placeHolderText}
          </Text>
        ) : (
          <Text ellipsis color="text" pr="20px">
            {pickMultiSelect.length > 0 ? pickMultiSelect.map((i) => options[i].label).join(', ') : ''}
          </Text>
        )}
        <ArrowDropDownIcon color="text" onClick={toggling} />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList>
          {options.map((option) => (
            <ListItem key={option.id} onClick={onOptionClicked(option.id)}>
              <Checkbox color="secondary" scale="xs" checked={isCheckboxValid(option.id)} />
              {option.label}
            </ListItem>
          ))}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default MultiSelector
