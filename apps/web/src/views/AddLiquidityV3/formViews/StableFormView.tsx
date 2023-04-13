import { CommonBasesType } from 'components/SearchModal/types'

import { AutoColumn, Button, Dots, RowBetween, Text, Box, AutoRow, Flex, QuestionHelper } from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import { Field } from 'state/mint/actions'
import { ApprovalState } from 'hooks/useApproveCallback'
import { logGTMClickAddLiquidityEvent } from 'utils/customGTMEventTracking'

import { useIsExpertMode } from '@pancakeswap/utils/user'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'

import { CurrencyLogo } from 'components/Logo'
import { useTotalUSDValue } from 'components/PositionCard'
import { CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { BIG_ONE_HUNDRED } from '@pancakeswap/utils/bigNumber'
import { AddStableChildrenProps } from 'views/AddLiquidity/AddStableLiquidity'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import { FormattedSlippage } from 'views/AddLiquidity/AddStableLiquidity/components/FormattedSlippage'
import FormattedCurrencyAmount from 'components/Chart/FormattedCurrencyAmount/FormattedCurrencyAmount'

import { RowFixed } from '../../../components/Layout/Row'

import { HideMedium, MediumOnly, RightContainer } from './V3FormView'

export default function StableFormView({
  formattedAmounts,
  shouldShowApprovalGroup,
  approveACallback,
  approvalA,
  approvalB,
  approveBCallback,
  showFieldBApproval,
  showFieldAApproval,
  currencies,
  buttonDisabled,
  onAdd,
  onPresentAddLiquidityModal,
  errorText,
  onFieldAInput,
  onFieldBInput,
  poolTokenPercentage,
  pair,
  reserves,
  stableLpFee,
  executionSlippage,
  loading,
  infoLoading,
  price,
  maxAmounts,
}: AddStableChildrenProps & {
  stableLpFee: number
}) {
  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const { account, isWrongNetwork } = useActiveWeb3React()
  const { t } = useTranslation()
  const expertMode = useIsExpertMode()

  const reservedToken0 = pair?.token0 ? CurrencyAmount.fromRawAmount(pair.token0, reserves[0].toString()) : null
  const reservedToken1 = pair?.token1 ? CurrencyAmount.fromRawAmount(pair.token1, reserves[1].toString()) : null

  const totalLiquidityUSD = useTotalUSDValue({
    currency0: pair?.token0,
    currency1: pair?.token1,
    token0Deposited: reservedToken0,
    token1Deposited: reservedToken1,
  })

  let buttons = null
  if (addIsUnsupported || addIsWarning) {
    buttons = (
      <Button disabled mb="4px">
        {t('Unsupported Asset')}
      </Button>
    )
  } else if (!account) {
    buttons = <ConnectWalletButton width="100%" />
  } else if (isWrongNetwork) {
    buttons = <CommitButton />
  } else {
    buttons = (
      <AutoColumn gap="md">
        {shouldShowApprovalGroup && (
          <RowBetween style={{ gap: '8px' }}>
            {showFieldAApproval && (
              <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%">
                {approvalA === ApprovalState.PENDING ? (
                  <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                ) : (
                  t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                )}
              </Button>
            )}
            {showFieldBApproval && (
              <Button onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING} width="100%">
                {approvalB === ApprovalState.PENDING ? (
                  <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                ) : (
                  t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                )}
              </Button>
            )}
          </RowBetween>
        )}
        <CommitButton
          variant={buttonDisabled ? 'danger' : 'primary'}
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            expertMode ? onAdd() : onPresentAddLiquidityModal()
            logGTMClickAddLiquidityEvent()
          }}
          disabled={buttonDisabled}
        >
          {errorText || t('Add')}
        </CommitButton>
      </AutoColumn>
    )
  }

  const [currency0, currency1] =
    currencies?.[Field.CURRENCY_A] &&
    currencies?.[Field.CURRENCY_B] &&
    currencies?.[Field.CURRENCY_A]?.wrapped?.sortsBefore(currencies?.[Field.CURRENCY_B]?.wrapped)
      ? [currencies?.[Field.CURRENCY_A], currencies?.[Field.CURRENCY_B]]
      : [currencies?.[Field.CURRENCY_B], currencies?.[Field.CURRENCY_A]]

  return (
    <>
      <AutoColumn>
        <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
          {t('Deposit Amount')}
        </Text>

        <CurrencyInputPanel
          showUSDPrice
          maxAmount={maxAmounts[Field.CURRENCY_A]}
          onMax={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')}
          onPercentInput={(percent) => {
            if (maxAmounts[Field.CURRENCY_A]) {
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
            }
          }}
          disableCurrencySelect
          value={formattedAmounts[Field.CURRENCY_A]}
          onUserInput={onFieldAInput}
          showQuickInputButton
          showMaxButton
          currency={currencies[Field.CURRENCY_A]}
          id="add-liquidity-input-tokena"
          showCommonBases
          commonBasesType={CommonBasesType.LIQUIDITY}
        />

        <CurrencyInputPanel
          showUSDPrice
          disableCurrencySelect
          maxAmount={maxAmounts[Field.CURRENCY_B]}
          onPercentInput={(percent) => {
            if (maxAmounts[Field.CURRENCY_B]) {
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
            }
          }}
          onMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}
          value={formattedAmounts[Field.CURRENCY_B]}
          onUserInput={onFieldBInput}
          showQuickInputButton
          showMaxButton
          currency={currencies[Field.CURRENCY_B]}
          id="add-liquidity-input-tokenb"
          showCommonBases
          commonBasesType={CommonBasesType.LIQUIDITY}
        />
      </AutoColumn>
      <HideMedium>{buttons}</HideMedium>

      <RightContainer>
        <AutoColumn>
          <Box>
            <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
              {t('Pool Reserves')}
            </Text>
            <Text fontSize="24px" fontWeight={500} mb="8px">
              $
              {totalLiquidityUSD
                ? totalLiquidityUSD.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '-'}
            </Text>
            <LightGreyCard mr="4px" mb="8px">
              <AutoRow justifyContent="space-between" mb="8px">
                <Flex>
                  <CurrencyLogo currency={currency0} />
                  <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                    {currency0?.symbol}
                  </Text>
                </Flex>
                <Flex justifyContent="center">
                  <Text mr="4px">
                    <FormattedCurrencyAmount currencyAmount={reservedToken0} />
                  </Text>
                </Flex>
              </AutoRow>
              <AutoRow justifyContent="space-between">
                <Flex>
                  <CurrencyLogo currency={currency1} />
                  <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                    {currency1?.symbol}
                  </Text>
                </Flex>
                <Flex justifyContent="center">
                  <Text mr="4px">
                    <FormattedCurrencyAmount currencyAmount={reservedToken1} />
                  </Text>
                </Flex>
              </AutoRow>
            </LightGreyCard>

            <AutoRow justifyContent="space-between" mb="4px">
              <Text color="textSubtle">{t('Price')}: </Text>

              <Text>
                {price?.toSignificant(6) ?? '-'}{' '}
                {t('%assetA% per %assetB%', {
                  assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
                  assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
                })}
              </Text>
            </AutoRow>

            <AutoRow justifyContent="space-between" mb="4px">
              <Text color="textSubtle">{t('Your share in pool')}: </Text>

              <Text>{poolTokenPercentage ? poolTokenPercentage?.toSignificant(4) : '-'}%</Text>
            </AutoRow>

            <AutoRow justifyContent="space-between" mb="4px">
              <Text color="textSubtle">{t('Fee rate')}: </Text>

              <Text>{stableLpFee ? BIG_ONE_HUNDRED.times(stableLpFee).toNumber() : '-'}%</Text>
            </AutoRow>

            <AutoRow justifyContent="space-between" mb="16px">
              <RowFixed>
                <Text color="textSubtle">{t('Slippage')}</Text>
                <QuestionHelper
                  text={t(
                    'Based on % contributed to stable pair, fees will vary. Deposits with fees >= 0.15% will be rejected',
                  )}
                  size="14px"
                  ml="4px"
                  placement="top-start"
                />
              </RowFixed>

              <FormattedSlippage
                slippage={executionSlippage}
                loading={!executionSlippage && (loading || infoLoading)}
              />
            </AutoRow>
          </Box>
          <MediumOnly>{buttons}</MediumOnly>
        </AutoColumn>
      </RightContainer>
    </>
  )
}
