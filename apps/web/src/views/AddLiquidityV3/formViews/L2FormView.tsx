import { CommonBasesType } from 'components/SearchModal/types'

import { AutoColumn, Button, Dots, RowBetween, Text } from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import _isNaN from 'lodash/isNaN'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import { Field } from 'state/mint/actions'
import { ApprovalState } from 'hooks/useApproveCallback'

import { useIsExpertMode } from 'state/user/hooks'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { HideMedium, MediumOnly, RightContainer } from './V3FormView'

// interface L2FormView {}

export default function L2FormView({
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
}) {
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
          onClick={() => (expertMode ? onAdd() : onPresentAddLiquidityModal())}
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
        <Text mb="8px" bold fontSize="14px" textTransform="uppercase" color="secondary">
          Deposit Amount
        </Text>

        <CurrencyInputPanel
          disableCurrencySelect
          showBUSD
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
          disableCurrencySelect
          showBUSD
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
          <MediumOnly>{buttons}</MediumOnly>
        </AutoColumn>
      </RightContainer>
    </>
  )
}
