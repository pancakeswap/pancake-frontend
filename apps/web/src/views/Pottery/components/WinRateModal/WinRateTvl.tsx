import { styled } from 'styled-components'
import Trans from 'components/Trans'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Button, Flex, Box, Balance } from '@pancakeswap/uikit'
import { WinRateCalculatorState } from 'views/Pottery/hooks/useWinRateCalculator'
import { ReactNode } from 'react'

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  padding: 8px 16px;
`

interface TvlType {
  title: string | ReactNode
  multiply: number
}

const tvlArray: TvlType[] = [
  { title: <Trans>Current</Trans>, multiply: 1 },
  { title: '+25%', multiply: 1.25 },
  { title: '+50%', multiply: 1.5 },
  { title: '+100%', multiply: 2 },
]

interface WinRateTvlProps {
  calculatorState: WinRateCalculatorState
  totalLockValue: number
  totalLockValueAsUSD: number
  setMultiplyNumber: (multiply: number) => void
}

const WinRateTvl: React.FC<React.PropsWithChildren<WinRateTvlProps>> = ({
  calculatorState,
  totalLockValue,
  totalLockValueAsUSD,
  setMultiplyNumber,
}) => {
  const { t } = useTranslation()
  const { multiply } = calculatorState.controls

  return (
    <>
      <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
        {t('TVL')}
      </Text>
      <Flex flexWrap="wrap" mb="8px">
        {tvlArray.map((tvl) => (
          <Button
            scale="sm"
            mt="4px"
            key={tvl.multiply}
            mr={['2px', '2px', '4px', '4px']}
            variant={multiply === tvl.multiply ? 'primary' : 'tertiary'}
            onClick={() => setMultiplyNumber(tvl.multiply)}
          >
            {tvl.title}
          </Button>
        ))}
      </Flex>
      <StyledBox>
        <Flex justifyContent="flex-end" mb="2px">
          <Balance textAlign="right" decimals={2} value={totalLockValue} />
          <Text ml="4px" color="textSubtle">
            CAKE
          </Text>
        </Flex>
        <Balance
          color="textSubtle"
          fontSize="12px"
          textAlign="right"
          decimals={2}
          value={totalLockValueAsUSD}
          unit=" USD"
        />
      </StyledBox>
    </>
  )
}

export default WinRateTvl
