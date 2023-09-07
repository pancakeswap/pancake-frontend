import { Modal, BoxProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ConfirmSwapModalContainerProps extends BoxProps {
  hideTitleAndBackground?: boolean
  headerPadding?: string
  bodyTop?: string
  bodyPadding?: string
  handleDismiss: () => void
}

const ConfirmSwapModalContainer: React.FC<React.PropsWithChildren<ConfirmSwapModalContainerProps>> = ({
  children,
  headerPadding,
  bodyTop,
  bodyPadding,
  hideTitleAndBackground,
  handleDismiss,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      {...props}
      title={hideTitleAndBackground ? '' : t('Confirm Swap')}
      headerPadding={hideTitleAndBackground && headerPadding ? headerPadding : '12px 24px'}
      bodyPadding={hideTitleAndBackground && bodyPadding ? bodyPadding : '24px'}
      bodyTop={bodyTop}
      headerBackground={hideTitleAndBackground ? 'transparent' : 'gradientCardHeader'}
      headerBorderColor={hideTitleAndBackground ? 'transparent' : null}
      onDismiss={handleDismiss}
    >
      {children}
    </Modal>
  )
}

export default ConfirmSwapModalContainer
