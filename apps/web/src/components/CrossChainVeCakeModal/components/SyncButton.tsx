import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { SwitchToBnbChainModal } from './SwitchToBnbCahinModal'

export const SyncButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const handleOnClick = useCallback(() => {
    setIsOpen(true)
  }, [])
  const handleOnDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])
  return (
    <>
      <Button width="50%" onClick={handleOnClick} {...props}>
        {t('Sync')}
      </Button>
      <SwitchToBnbChainModal isOpen={isOpen} setIsOpen={setIsOpen} onDismiss={handleOnDismiss} />
    </>
  )
}
