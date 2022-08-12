import { useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Button,
  Flex,
  ButtonMenu,
  Checkbox,
  BalanceInput,
  HelpIcon,
  ButtonMenuItem,
  useTooltip,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from 'utils/formatBalance'

import { useWeb3React } from '@web3-react/core'
import RoiCalculatorFooter from './RoiCalculatorFooter'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, {
  CalculatorMode,
  DefaultCompoundStrategy,
  EditingCurrency,
} from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'

export interface RoiCalculatorModalProps {
  onDismiss?: () => void
  onBack?: () => void
  earningTokenPrice: number
  apr?: number
  apy?: number
  displayApr?: string
  linkLabel: string
  linkHref: string
  stakingTokenBalance: BigNumber
  stakingTokenSymbol: string
  stakingTokenPrice: number
  earningTokenSymbol?: string
  multiplier?: string
  autoCompoundFrequency?: number
  performanceFee?: number
  isFarm?: boolean
  initialState?: any
  initialValue?: string
  strategy?: any
  header?: React.ReactNode
}

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

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const RoiCalculatorModal: React.FC<React.PropsWithChildren<RoiCalculatorModalProps>> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  apy,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol = 'CAKE',
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
  initialState,
  strategy,
  header,
  children,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const balanceInputRef = useRef<HTMLInputElement | null>(null)

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleCompounding,
    toggleEditingCurrency,
    setCompoundingFrequency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  } = useRoiCalculatorReducer({ stakingTokenPrice, earningTokenPrice, autoCompoundFrequency }, initialState)

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isFarm
      ? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
      : t(
          '“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
          { assetSymbol: stakingTokenSymbol },
        ),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const DURATION = useMemo(() => [t('1D'), t('7D'), t('30D'), t('1Y'), t('5Y')], [t])

  return (
    <StyledModal
      title={t('ROI Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradients.cardHeader"
    >
      <ScrollableContainer>
        {strategy ? (
          strategy(state, dispatch)
        ) : (
          <DefaultCompoundStrategy
            apr={apy ?? apr}
            dispatch={dispatch}
            state={state}
            earningTokenPrice={earningTokenPrice}
            performanceFee={performanceFee}
            stakingTokenPrice={stakingTokenPrice}
          />
        )}
        {header}
        <Flex flexDirection="column" mb="8px">
          <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
            {t('%asset% staked', { asset: stakingTokenSymbol })}
          </Text>
          <BalanceInput
            inputProps={{
              scale: 'sm',
            }}
            currencyValue={`${conversionValue} ${conversionUnit}`}
            innerRef={balanceInputRef}
            placeholder="0.00"
            value={editingValue}
            unit={editingUnit}
            onUserInput={onUserInput}
            switchEditingUnits={toggleEditingCurrency}
            onFocus={onBalanceFocus}
          />
          <Flex justifyContent="space-between" mt="8px">
            <Button
              scale="xs"
              p="4px 16px"
              width="68px"
              variant="tertiary"
              onClick={() => setPrincipalFromUSDValue('100')}
            >
              $100
            </Button>
            <Button
              scale="xs"
              p="4px 16px"
              width="68px"
              variant="tertiary"
              onClick={() => setPrincipalFromUSDValue('1000')}
            >
              $1000
            </Button>
            <Button
              disabled={
                !Number.isFinite(stakingTokenPrice) ||
                !stakingTokenBalance.isFinite() ||
                stakingTokenBalance.lte(0) ||
                !account
              }
              scale="xs"
              p="4px 16px"
              width="128px"
              variant="tertiary"
              onClick={() =>
                setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
              }
            >
              {t('My Balance').toLocaleUpperCase()}
            </Button>
            <span ref={targetRef}>
              <HelpIcon width="16px" height="16px" color="textSubtle" />
            </span>
            {tooltipVisible && tooltip}
          </Flex>
          {children || (
            <>
              <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
                {t('Staked for')}
              </Text>
              <FullWidthButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
                {DURATION.map((duration) => (
                  <ButtonMenuItem key={duration} variant="tertiary">
                    {duration}
                  </ButtonMenuItem>
                ))}
              </FullWidthButtonMenu>
            </>
          )}
          {autoCompoundFrequency === 0 && (
            <>
              <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
                {t('Compounding every')}
              </Text>
              <Flex alignItems="center">
                <Flex flex="1">
                  <Checkbox scale="sm" checked={compounding} onChange={toggleCompounding} />
                </Flex>
                <Flex flex="6">
                  <FullWidthButtonMenu
                    disabled={!compounding}
                    activeIndex={activeCompoundingIndex}
                    onItemClick={setCompoundingFrequency}
                    scale="sm"
                  >
                    <ButtonMenuItem>{t('1D')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('7D')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('14D')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('30D')}</ButtonMenuItem>
                  </FullWidthButtonMenu>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
        <AnimatedArrow calculatorState={state} />
        <Flex>
          <RoiCard
            earningTokenSymbol={earningTokenSymbol}
            calculatorState={state}
            setTargetRoi={setTargetRoi}
            setCalculatorMode={setCalculatorMode}
          />
        </Flex>
      </ScrollableContainer>
      <RoiCalculatorFooter
        isFarm={isFarm}
        apr={apr}
        apy={apy}
        displayApr={displayApr}
        autoCompoundFrequency={autoCompoundFrequency}
        multiplier={multiplier}
        linkLabel={linkLabel}
        linkHref={linkHref}
        performanceFee={performanceFee}
      />
    </StyledModal>
  )
}

export default RoiCalculatorModal
