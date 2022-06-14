import { useRef, useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { Modal, Text, Box, Button, Flex, BalanceInput, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { CalculatorMode } from '../../types'
import AnimatedArrow from './AnimatedArrow'
import WinRateCard from './WinRateCard'
import WinRateFooter from './WinRateFooter'

const StyledModal = styled(Modal)`
  width: 380px;
  & > :nth-child(2) {
    padding: 0;
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

export interface WinRateModalProps {
  onDismiss?: () => void
  onBack?: () => void
}

const WinRateModal: React.FC<WinRateModalProps> = ({ onDismiss, onBack }) => {
  const { t } = useTranslation()
  const [balance, setBalance] = useState('')
  const [totalLockValue, setTotalLockValue] = useState('')
  const [calculatorMode, setCalculatorMode] = useState(CalculatorMode.WIN_RATE_BASED_ON_PRINCIPAL)
  const balanceInputRef = useRef<HTMLInputElement | null>(null)

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Fake Text'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.WIN_RATE_BASED_ON_PRINCIPAL)
  }

  return (
    <StyledModal
      title={t('Winning % Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradients.cardHeader"
    >
      <ScrollableContainer>
        <Flex flexDirection="column" mb="8px">
          <Box>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase" as="span">
              {t('Cake')}
            </Text>
            <Text color="textSubtle" ml="4px" bold fontSize="12px" textTransform="uppercase" as="span">
              {t('Deposit')}
            </Text>
          </Box>
          <BalanceInput
            unit="CAKE"
            placeholder="0.00"
            currencyValue="USD"
            value={balance}
            innerRef={balanceInputRef}
            inputProps={{ scale: 'sm' }}
            onFocus={onBalanceFocus}
            onUserInput={(value) => {
              setBalance(value)
            }}
          />
          <Flex justifyContent="space-between" mt="8px">
            <Button
              scale="xs"
              p="4px 16px"
              width="68px"
              variant="tertiary"
              // onClick={() => setPrincipalFromUSDValue('100')}
            >
              $100
            </Button>
            <Button
              scale="xs"
              p="4px 16px"
              width="68px"
              variant="tertiary"
              // onClick={() => setPrincipalFromUSDValue('1000')}
            >
              $1000
            </Button>
            <Button
              scale="xs"
              p="4px 16px"
              width="128px"
              variant="tertiary"
              // onClick={() =>
              //   setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
              // }
            >
              {t('My Balance').toLocaleUpperCase()}
            </Button>
            <span ref={targetRef}>
              <HelpIcon width="16px" height="16px" color="textSubtle" />
            </span>
            {tooltipVisible && tooltip}
          </Flex>
          <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
            {t('TVL')}
          </Text>
          <Flex flexWrap="wrap" mb="8px">
            <Button variant="primary" mt="4px" mr={['2px', '2px', '4px', '4px']} scale="sm">
              Current
            </Button>
            <Button variant="tertiary" mt="4px" mr={['2px', '2px', '4px', '4px']} scale="sm">
              +25%
            </Button>
            <Button variant="tertiary" mt="4px" mr={['2px', '2px', '4px', '4px']} scale="sm">
              +50%
            </Button>
            <Button variant="tertiary" mt="4px" mr={['2px', '2px', '4px', '4px']} scale="sm">
              +100%
            </Button>
          </Flex>
          <BalanceInput
            unit="CAKE"
            placeholder="0.00"
            currencyValue="USD"
            value={totalLockValue}
            inputProps={{ scale: 'sm' }}
            onUserInput={(value) => {
              setTotalLockValue(value)
            }}
          />
        </Flex>
        <AnimatedArrow mode={calculatorMode} />
        <WinRateCard mode={calculatorMode} setCalculatorMode={setCalculatorMode} />
      </ScrollableContainer>
      <WinRateFooter />
    </StyledModal>
  )
}

export default WinRateModal
