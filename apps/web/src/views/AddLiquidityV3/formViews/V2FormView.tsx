import { CommonBasesType } from 'components/SearchModal/types'

import {
  AutoColumn,
  Button,
  Dots,
  RowBetween,
  Text,
  Box,
  BunnyKnownPlaceholder,
  DynamicSection,
} from '@pancakeswap/uikit'
import { logGTMClickAddLiquidityEvent } from 'utils/customGTMEventTracking'

import { CommitButton } from 'components/CommitButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import { Field } from 'state/mint/actions'
import { ApprovalState } from 'hooks/useApproveCallback'

import { useIsExpertMode } from '@pancakeswap/utils/user'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { Bound } from 'config/constants/types'
import { InfoBox } from 'components/InfoBox'
import { LP2ChildrenProps } from 'views/AddLiquidity'
import { Percent } from '@pancakeswap/sdk'

import { HideMedium, MediumOnly, RightContainer } from './V3FormView'
import RangeSelector from './V3FormView/components/RangeSelector'

export default function V2FormView({
  formattedAmounts,
  addIsUnsupported,
  addIsWarning,
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
  maxAmounts,
}: LP2ChildrenProps) {
  const mockFn = useCallback(() => '', [])

  const { account, isWrongNetwork } = useActiveWeb3React()
  const { t } = useTranslation()
  const expertMode = useIsExpertMode()

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

  return (
    <>
      <AutoColumn>
        <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
          {t('Deposit Amount')}
        </Text>

        <Box mb="8px">
          <CurrencyInputPanel
            maxAmount={maxAmounts[Field.CURRENCY_A]}
            showUSDPrice
            onMax={() => {
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
            }}
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
        </Box>

        <CurrencyInputPanel
          showUSDPrice
          onPercentInput={(percent) => {
            if (maxAmounts[Field.CURRENCY_B]) {
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
            }
          }}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
          }}
          maxAmount={maxAmounts[Field.CURRENCY_B]}
          disableCurrencySelect
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
        <AutoColumn pt="12px" gap="24px">
          <DynamicSection disabled gap="12px">
            <InfoBox message={t('Your position will appear here.')} icon={<BunnyKnownPlaceholder />} />
            <RangeSelector
              getDecrementLower={mockFn}
              getIncrementLower={mockFn}
              getDecrementUpper={mockFn}
              getIncrementUpper={mockFn}
              onLeftRangeInput={mockFn}
              onRightRangeInput={mockFn}
              currencyA={currencies[Field.CURRENCY_A]}
              currencyB={currencies[Field.CURRENCY_B]}
              feeAmount={0}
              ticksAtLimit={{
                [Bound.LOWER]: false,
                [Bound.UPPER]: false,
              }}
            />
          </DynamicSection>
          <MediumOnly>{buttons}</MediumOnly>
        </AutoColumn>
      </RightContainer>
    </>
  )
}
