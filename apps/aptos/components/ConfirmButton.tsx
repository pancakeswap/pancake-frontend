import { useTranslation } from '@pancakeswap/localization'
import { Button as UIKitButton, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'

interface ConfirmButtonProps {
  isConfirming: boolean
  isConfirmDisabled: boolean
  onConfirm: () => void
}

const Button = styled(UIKitButton)`
  width: 100%;
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

export const ConfirmButton: React.FC<React.PropsWithChildren<ConfirmButtonProps>> = ({
  isConfirming,
  isConfirmDisabled,
  onConfirm,
}) => {
  const { t } = useTranslation()

  return (
    <Button
      onClick={onConfirm}
      disabled={isConfirmDisabled}
      isLoading={isConfirming}
      endIcon={isConfirming ? spinnerIcon : undefined}
    >
      {isConfirming ? t('Confirming') : t('Confirm')}
    </Button>
  )
}
