import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Flex, Text, Input, CheckmarkIcon, PencilIcon, IconButton } from '@pancakeswap/uikit'
import { CalculatorMode } from '../../types'

const WinRateWrapper = styled(Box)`
  background: linear-gradient(180deg, #53dee9, #7645d9);
  padding: 1px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
`

const WinRateCardInner = styled(Box)`
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

const WinRateInputContainer = styled(Box)`
  position: relative;
  & > input {
    padding-left: 28px;
    max-width: 70%;
  }
  &:before {
    position: absolute;
    content: '$';
    color: ${({ theme }) => theme.colors.textSubtle};
    left: 16px;
    top: 8px;
  }
`

interface WinRateCardProps {
  mode: CalculatorMode
  setCalculatorMode: (mode: CalculatorMode) => void
}

const WinRateCard: React.FC<WinRateCardProps> = ({ mode, setCalculatorMode }) => {
  const { t } = useTranslation()
  const [expectedWinRate, setExpectedWinRate] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_WIN_RATE && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mode])

  const onEnterEditing = () => {
    setCalculatorMode(CalculatorMode.PRINCIPAL_BASED_ON_WIN_RATE)
  }

  const onExitWinRateEditing = () => {
    setCalculatorMode(CalculatorMode.WIN_RATE_BASED_ON_PRINCIPAL)
  }

  const handleExpectedWinRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.validity.valid) {
      const winRateAsString = event.target.value.replace(/,/g, '.')
      setExpectedWinRate(winRateAsString)
    }
  }

  return (
    <WinRateWrapper>
      <WinRateCardInner>
        <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
          {t('winning chance')}
        </Text>
        <Flex justifyContent="space-between" mt="4px" height="36px">
          {mode === CalculatorMode.PRINCIPAL_BASED_ON_WIN_RATE ? (
            <>
              <WinRateInputContainer>
                <Input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+[.,]?[0-9]*$"
                  scale="sm"
                  value={expectedWinRate}
                  placeholder="0.0"
                  onChange={handleExpectedWinRateChange}
                />
              </WinRateInputContainer>
              <IconButton scale="sm" variant="text" onClick={onExitWinRateEditing}>
                <CheckmarkIcon color="primary" />
              </IconButton>
            </>
          ) : (
            <>
              <Text maxWidth="82%" mr="8px" fontSize="24px" bold>
                28.46%
              </Text>
              <IconButton scale="sm" variant="text" onClick={onEnterEditing}>
                <PencilIcon color="primary" />
              </IconButton>
            </>
          )}
        </Flex>
      </WinRateCardInner>
    </WinRateWrapper>
  )
}

export default WinRateCard
