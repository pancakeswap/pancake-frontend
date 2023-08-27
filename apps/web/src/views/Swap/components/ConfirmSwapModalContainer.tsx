import { Modal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ConfirmSwapModalContainerProps {
  hideTitleAndBackground?: boolean
  handleDismiss: () => void
}

const ConfirmSwapModalContainer: React.FC<React.PropsWithChildren<ConfirmSwapModalContainerProps>> = ({
  children,
  hideTitleAndBackground,
  handleDismiss,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
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
