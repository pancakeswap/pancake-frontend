import React, { useEffect } from 'react'
import { ScrollView } from '@binance/mp-components'
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
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTooltip } from 'contexts/bmp/TooltipContext'
import RoiCalculatorFooter from './RoiCalculatorFooter.bmp'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, { CalculatorMode, EditingCurrency } from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'

interface RoiCalculatorModalProps {
  onDismiss?: () => void
  onBack?: () => void
  earningTokenPrice: number
  apr: number
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
  initialValue?: string
  jumpToLiquidity: () => void
}

const StyledModal = styled(Modal)`
  width: 345px;
  & > :nth-child(2) {
    padding: 0;
  }
`

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
    box-shadow: none;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol = 'AKE',
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
  jumpToLiquidity,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

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
  } = useRoiCalculatorReducer(stakingTokenPrice, earningTokenPrice, apr, autoCompoundFrequency, performanceFee)

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { onPresent } = useTooltip(
    isFarm
      ? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
      : t(
          '“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
          { assetSymbol: stakingTokenSymbol },
        ),
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  return (
    <StyledModal
      title={t('ROI Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradients.cardHeader"
    >
      <ScrollView scrollY showScrollbar style={{ maxHeight: '70vh', width: 'unset' }}>
        <view style={{ padding: '24px' }}>
          <Flex flexDirection="column" mb="8px">
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('%asset% staked', { asset: stakingTokenSymbol })}
            </Text>
            <BalanceInput
              currencyValue={`${conversionValue} ${conversionUnit}`}
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
                disabled={!stakingTokenBalance.isFinite() || stakingTokenBalance.lte(0) || !account}
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
              <view onClick={onPresent}>
                <HelpIcon width="16px" height="16px" color="textSubtle" />
              </view>
            </Flex>
            <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('Staked for')}
            </Text>
            <FullWidthButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
              <ButtonMenuItem variant="tertiary">{t('1D')}</ButtonMenuItem>
              <ButtonMenuItem variant="tertiary">{t('7D')}</ButtonMenuItem>
              <ButtonMenuItem variant="tertiary">{t('30D')}</ButtonMenuItem>
              <ButtonMenuItem variant="tertiary">{t('1Y')}</ButtonMenuItem>
              <ButtonMenuItem variant="tertiary">{t('5Y')}</ButtonMenuItem>
            </FullWidthButtonMenu>
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
        </view>
        <RoiCalculatorFooter
          onDismiss={onDismiss}
          jumpToLiquidity={jumpToLiquidity}
          isFarm={isFarm}
          apr={apr}
          displayApr={displayApr}
          autoCompoundFrequency={autoCompoundFrequency}
          multiplier={multiplier}
          linkLabel={linkLabel}
          linkHref={linkHref}
          performanceFee={performanceFee}
        />
      </ScrollView>
    </StyledModal>
  )
}

export default RoiCalculatorModal
