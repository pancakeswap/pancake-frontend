import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import { useState } from 'react'
import { CrossChainVeCakeModal } from '../index'

export const SyncButton = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button width="50%" onClick={() => setIsOpen(true)}>
        {t('Sync')}
      </Button>
      <CrossChainVeCakeModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDismiss={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}
