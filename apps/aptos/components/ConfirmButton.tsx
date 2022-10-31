import { useTranslation } from '@pancakeswap/localization'
import { Button as UIKitButton, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'

export enum ButtonArrangement {
  ROW = 'row',
  SEQUENTIAL = 'sequential',
}

interface ConfirmButtonProps {
  isConfirming: boolean
  isConfirmDisabled: boolean
  onConfirm: () => void
  buttonArrangement?: ButtonArrangement
  confirmLabel?: string
  confirmId?: string
}

const Button = styled(UIKitButton)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 160px;
  }
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

export const ConfirmButton: React.FC<React.PropsWithChildren<ConfirmButtonProps>> = ({
  isConfirming,
  isConfirmDisabled,
  onConfirm,
  confirmLabel,
  confirmId,
}) => {
  const { t } = useTranslation()
  const confirmButtonText = confirmLabel ?? t('Confirm')

  return (
    <Button
      id={confirmId}
      onClick={onConfirm}
      disabled={isConfirmDisabled}
      isLoading={isConfirming}
      endIcon={isConfirming ? spinnerIcon : undefined}
    >
      {isConfirming ? t('Confirming') : confirmButtonText}
    </Button>
  )
}
