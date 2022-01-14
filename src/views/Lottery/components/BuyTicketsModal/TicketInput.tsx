import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Ticket, UpdateTicketAction } from './useTicketsReducer'

const InputsContainer = styled.div<{ focused: boolean; isDuplicate: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  box-sizing: border-box;
  border: 1px solid #d7caec;
  background-color: #eeeaf4;
  border-radius: 16px;
  margin-bottom: 8px;
  ${({ isDuplicate }) =>
    isDuplicate &&
    `
    border: 1px solid #FFB237;
    box-shadow: 0px 0px 0px 2px #FFB237;
  `}
  ${({ focused }) =>
    focused &&
    `
    border: 1px solid #7645D9;
    box-shadow: 0px 0px 0px 2px #E4DAF7;
  `}
`

const DigitInput = styled.input`
  border: none;
  height: 32px;
  padding: 0 12px;
  font-size: 16px;
  flex: 1;
  width: 16px;
  text-align: center;
  min-width: 0;
  background-color: transparent;
  caret-color: #7a6faa;

  &::placeholder {
    text-align: center;
  }

  &:placeholder-shown {
    text-align: left;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  -moz-appearance: textfield; /* Firefox */
`

const getIdLabel = (id: number): string => {
  if (id < 10) return `#00${id}`
  if (id < 100) return `#0${id}`
  return `#${id}`
}

const TicketContainer: React.FC<{
  ticket: Ticket
  duplicateWith: number[]
  updateTicket: UpdateTicketAction
  disabled: boolean
}> = ({ ticket, duplicateWith, updateTicket, disabled }) => {
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const digit1 = useRef<HTMLInputElement>(null)
  const digit2 = useRef<HTMLInputElement>(null)
  const digit3 = useRef<HTMLInputElement>(null)
  const digit4 = useRef<HTMLInputElement>(null)
  const digit5 = useRef<HTMLInputElement>(null)
  const digit6 = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()

  const digitRefs = [digit1, digit2, digit3, digit4, digit5, digit6]

  const scrollInputIntoView = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }

  const onPasteHandler = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteContent = e.clipboardData.getData('Text')
    if (pasteContent.length <= 6 && /^\d+$/.test(pasteContent)) {
      const filler = Array(6 - pasteContent.length).fill('')
      updateTicket(ticket.id, [...pasteContent.split(''), ...filler])
    }
  }

  const onFocusHandler = () => {
    scrollInputIntoView()
    setFocused(true)
  }

  const onBlurHandler = () => {
    setFocused(false)
  }

  const onChangeHandler = (event: React.KeyboardEvent, digitId: number) => {
    const currentKey = parseInt(event.key, 10)

    if (['e', 'E', '.', ',', '-', 'Unidentified'].includes(event.key)) {
      event.preventDefault()
      return
    }

    // Handling numeric inputs
    if (currentKey >= 0 && currentKey <= 9) {
      event.preventDefault()
      const newNumbers = [...ticket.numbers]
      newNumbers[digitId] = `${currentKey}`
      updateTicket(ticket.id, newNumbers)
      const nextDigitId = digitId + 1
      // if we're not on the last digit - auto-tab
      const nextInput = digitRefs[nextDigitId]
      if (nextDigitId !== 6 && nextInput.current) {
        nextInput.current.focus()
      }
    }

    if (event.key === 'Backspace') {
      event.preventDefault()
      // If some number is there - delete the number
      if (ticket.numbers[digitId]) {
        const newNumbers = [...ticket.numbers]
        newNumbers[digitId] = ''
        updateTicket(ticket.id, newNumbers)
      } else {
        // if the cell is empty and user presses backspace - remove previous
        const prevDigitId = digitId - 1
        const nextInput = digitRefs[prevDigitId]
        // prevent focusing on non-existent input
        if (prevDigitId !== -1 && nextInput.current) {
          nextInput.current.focus()
          const newNumbers = [...ticket.numbers]
          newNumbers[prevDigitId] = ''
          updateTicket(ticket.id, newNumbers)
        }
      }
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      if (ticket.numbers[digitId]) {
        const newNumbers = [...ticket.numbers]
        newNumbers[digitId] = ''
        updateTicket(ticket.id, newNumbers)
      } else {
        // if the cell is empty and user presses delete - remove next
        const nextDigitId = digitId + 1
        const nextInput = digitRefs[nextDigitId]
        // prevent focusing on non-existent input
        if (nextDigitId !== 6 && nextInput.current) {
          nextInput.current.focus()
          const newNumbers = [...ticket.numbers]
          newNumbers[nextDigitId] = ''
          updateTicket(ticket.id, newNumbers)
        }
      }
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const prevDigitId = digitId - 1
      const nextInput = digitRefs[prevDigitId]
      // prevent focusing on non-existent input
      if (prevDigitId !== -1 && nextInput.current) {
        nextInput.current.focus()
      }
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const nextDigitId = digitId + 1
      const nextInput = digitRefs[nextDigitId]
      // prevent focusing on non-existent input
      if (nextDigitId !== 6 && nextInput.current) {
        nextInput.current.focus()
      }
    }
  }
  return (
    <>
      <Flex justifyContent="space-between">
        <Text fontSize="12px" color="textSubtle">
          {getIdLabel(ticket.id)}
        </Text>
        <Text fontSize="12px" color="warning">
          {duplicateWith.length !== 0 && t('Duplicate')}
        </Text>
      </Flex>
      <InputsContainer
        ref={containerRef}
        onClick={scrollInputIntoView}
        focused={focused}
        isDuplicate={duplicateWith.length !== 0}
      >
        <DigitInput
          ref={digit1}
          type="number"
          value={ticket.numbers[0]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 0)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
        <DigitInput
          ref={digit2}
          type="number"
          value={ticket.numbers[1]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 1)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
        <DigitInput
          ref={digit3}
          type="number"
          value={ticket.numbers[2]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 2)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
        <DigitInput
          ref={digit4}
          type="number"
          value={ticket.numbers[3]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 3)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
        <DigitInput
          ref={digit5}
          type="number"
          value={ticket.numbers[4]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 4)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
        <DigitInput
          ref={digit6}
          type="number"
          value={ticket.numbers[5]}
          onKeyDown={(e: React.KeyboardEvent) => onChangeHandler(e, 5)}
          placeholder="_"
          onChange={(e) => e.preventDefault()}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPaste={onPasteHandler}
          inputMode="numeric"
        />
      </InputsContainer>
    </>
  )
}

export default TicketContainer
