import { useTranslation } from '@pancakeswap/localization'
import { Button, InjectedModalProps, Modal, useModal } from '@pancakeswap/uikit'
import { memo, useCallback, useEffect } from 'react'

export const FiatOnRampModalButtonMercury = () => {
  const { t } = useTranslation()
  const [onPresentConfirmModal] = useModal(<FiatOnRampModalMecuryo />)

  return (
    <Button height="35px" onClick={onPresentConfirmModal} disabled={false} isLoading={false} variant="secondary">
      {t('Buy Crypto')}
    </Button>
  )
}

export const FiatOnRampModalMecuryo = memo<InjectedModalProps>(function ConfirmSwapModalComp({ onDismiss }) {
  const handleDismiss = useCallback(() => {
    onDismiss?.()
  }, [onDismiss])

  useEffect(() => {
    // @ts-ignore
    const MC_WIDGET = mercuryoWidget
    MC_WIDGET.run({
      widgetId: '64d1f9f9-85ee-4558-8168-1dc0e7057ce6',
      host: document.getElementById('mercuryo-widget'),
    })
  }, [])

  return (
    <Modal
      title="Buy Crypto In One Click"
      onDismiss={handleDismiss}
      bodyPadding="0px"
      headerBackground="gradientCardHeader"
      height="600px" // height has to be overidden
      width="370px" // width has to be overidden
    >
      <div id="mercuryo-widget" />
    </Modal>
  )
})

export default FiatOnRampModalMecuryo
