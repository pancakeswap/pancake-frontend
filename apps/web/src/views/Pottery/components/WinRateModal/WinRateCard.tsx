import { useRef, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Input, CheckmarkIcon, PencilIcon, IconButton } from '@pancakeswap/uikit'
import { WinRateCalculatorState } from 'views/Pottery/hooks/useWinRateCalculator'
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
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const WinRateInputContainer = styled(Box)`
  position: relative;
  & > input {
    padding-right: 28px;
    max-width: 70%;
  }
  &:before {
    position: absolute;
    content: '%';
    color: ${({ theme }) => theme.colors.textSubtle};
    left: 140px;
    top: 8px;
  }
`

interface WinRateCardProps {
  winRate: number
  calculatorState: WinRateCalculatorState
  setCalculatorMode: (mode: CalculatorMode) => void
  setTargetWinRate: (percentage: string) => void
}

const WinRateCard: React.FC<React.PropsWithChildren<WinRateCardProps>> = ({
  winRate,
  calculatorState,
  setCalculatorMode,
  setTargetWinRate,
}) => {
  const { t } = useTranslation()
  const [expectedWinRate, setExpectedWinRate] = useState('')
  const { mode } = calculatorState.controls
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
    setExpectedWinRate(
      winRate.toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    )
  }

  const handleExpectedWinRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.validity.valid) {
      const winRateAsString = event.target.value.replace(/,/g, '.')
      const percentage = Number(winRateAsString) >= 100 ? '100' : winRateAsString
      setTargetWinRate(percentage)
      setExpectedWinRate(percentage)
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
                  scale="sm"
                  type="text"
                  placeholder="0.0"
                  inputMode="decimal"
                  pattern="^[0-9]{0,3}(?:\.[0-9]{0,2})?$"
                  value={expectedWinRate}
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
                {winRate.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
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
