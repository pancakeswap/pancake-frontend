import { Modal, BoxProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ConfirmSwapModalContainerProps extends BoxProps {
  hideTitleAndBackground?: boolean
  handleDismiss: () => void
}

const ConfirmSwapModalContainer: React.FC<React.PropsWithChildren<ConfirmSwapModalContainerProps>> = ({
  children,
  hideTitleAndBackground,
  handleDismiss,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      {...props}
      title={hideTitleAndBackground ? '' : t('Confirm Swap')}
      headerBackground={hideTitleAndBackground ? 'transparent' : 'gradientCardHeader'}
      headerBorderColor={hideTitleAndBackground ? 'transparent' : null}
      onDismiss={handleDismiss}
    >
      {children}
    </Modal>
  )
}

export default ConfirmSwapModalContainer
