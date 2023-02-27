import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Modal, Text, Box, Flex, BalanceInput } from '@pancakeswap/uikit'
import useWinRateCalculator from 'views/Pottery/hooks/useWinRateCalculator'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useVaultApy } from 'hooks/useVaultApy'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { CalculatorMode, EditingCurrency } from '../../types'
import ButtonMenu from './ButtonMenu'
import WinRateTvl from './WinRateTvl'
import AnimatedArrow from './AnimatedArrow'
import WinRateCard from './WinRateCard'
import WinRateFooter from './WinRateFooter'

const StyledModal = styled(Modal)`
  & > :nth-child(2) {
    padding: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 380px;
  }
`

const ScrollableContainer = styled.div`
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

interface WinRateModalProps {
  onDismiss?: () => void
  onBack?: () => void
  stakingTokenBalance: BigNumber
  totalSupply: BigNumber
}

const WinRateModal: React.FC<React.PropsWithChildren<WinRateModalProps>> = ({
  onDismiss,
  onBack,
  stakingTokenBalance,
  totalSupply,
}) => {
  const { t } = useTranslation()
  const cakePrice = usePriceCakeBusd()
  const { getLockedApy } = useVaultApy()
  const balanceInputRef = useRef<HTMLInputElement | null>(null)
  const apy = getLockedApy(weeksToSeconds(10))

  const {
    state,
    winRate,
    totalLockValue,
    totalLockValueAsUSD,
    setMultiplyNumber,
    setPrincipalFromTokenValue,
    setPrincipalFromUSDValue,
    toggleEditingCurrency,
    setCalculatorMode,
    setTargetWinRate,
  } = useWinRateCalculator({ cakePrice, totalSupply })

  const { principalAsUSD, principalAsToken } = state.data
  const { editingCurrency } = state.controls

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.WIN_RATE_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? 'CAKE' : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : 'CAKE'
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  return (
    <StyledModal
      title={t('Winning % Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradientCardHeader"
    >
      <ScrollableContainer>
        <Flex flexDirection="column" mb="8px">
          <Box>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase" as="span">
              Cake
            </Text>
            <Text color="textSubtle" ml="4px" bold fontSize="12px" textTransform="uppercase" as="span">
              {t('Deposit')}
            </Text>
          </Box>
          <BalanceInput
            unit={editingUnit}
            placeholder="0.00"
            currencyValue={`${conversionValue} ${conversionUnit}`}
            value={editingValue}
            innerRef={balanceInputRef}
            inputProps={{ scale: 'sm' }}
            onUserInput={onUserInput}
            onFocus={onBalanceFocus}
            switchEditingUnits={toggleEditingCurrency}
          />
          <ButtonMenu
            cakePrice={cakePrice}
            stakingTokenBalance={stakingTokenBalance}
            setPrincipalFromUSDValue={setPrincipalFromUSDValue}
          />
          <WinRateTvl
            calculatorState={state}
            totalLockValue={totalLockValue}
            totalLockValueAsUSD={totalLockValueAsUSD}
            setMultiplyNumber={setMultiplyNumber}
          />
        </Flex>
        <AnimatedArrow calculatorState={state} />
        <WinRateCard
          winRate={winRate}
          calculatorState={state}
          setCalculatorMode={setCalculatorMode}
          setTargetWinRate={setTargetWinRate}
        />
      </ScrollableContainer>
      <WinRateFooter apy={Number(apy)} />
    </StyledModal>
  )
}

export default WinRateModal
