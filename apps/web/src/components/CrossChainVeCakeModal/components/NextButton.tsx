import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import { useState } from 'react'
import { SwitchToBnbChainModal } from './SwitchToBnbCahinModal'

export const NextButton = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button width="50%" onClick={() => setIsOpen(true)}>
        {t('Next')}
      </Button>
      <SwitchToBnbChainModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDismiss={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}
