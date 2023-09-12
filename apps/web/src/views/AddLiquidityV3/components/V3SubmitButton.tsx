import { useTranslation } from '@pancakeswap/localization'
import { SendTransactionResult } from 'wagmi/actions'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { AutoColumn, Button, Dots, RowBetween } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ApprovalState } from 'hooks/useApproveCallback'
import { ReactNode } from 'react'
import { Field } from '../formViews/V3FormView/form/actions'

interface V3SubmitButtonProps {
  addIsUnsupported: boolean
  addIsWarning: boolean
  account: string
  isWrongNetwork: boolean
  approvalA: ApprovalState
  approvalB: ApprovalState
  isValid: boolean
  showApprovalA: boolean
  approveACallback: () => Promise<SendTransactionResult>
  currencies: {
    CURRENCY_A?: Currency
    CURRENCY_B?: Currency
  }
  approveBCallback: () => Promise<SendTransactionResult>
  showApprovalB: boolean
  parsedAmounts: {
    CURRENCY_A?: CurrencyAmount<Currency>
    CURRENCY_B?: CurrencyAmount<Currency>
  }
  onClick: () => void | Promise<void>
  attemptingTxn: boolean
  errorMessage: ReactNode
  buttonText: string
  depositADisabled: boolean
  depositBDisabled: boolean
}

export function V3SubmitButton({
  addIsUnsupported,
  addIsWarning,
  account,
  isWrongNetwork,
  approvalA,
  approvalB,
  isValid,
  showApprovalA,
  approveACallback,
  currencies,
  approveBCallback,
  showApprovalB,
  parsedAmounts,
  onClick,
  attemptingTxn,
  errorMessage,
  buttonText,
  depositADisabled,
  depositBDisabled,
}: V3SubmitButtonProps) {
  const { t } = useTranslation()

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
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween style={{ gap: '8px' }}>
              {showApprovalA && (
                <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%">
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                  ) : (
                    t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                  )}
                </Button>
              )}
              {showApprovalB && (
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
          variant={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
          }
          onClick={onClick}
          disabled={
            !isValid ||
            attemptingTxn ||
            (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
        >
          {errorMessage || buttonText}
        </CommitButton>
      </AutoColumn>
    )
  }

  return buttons
}
