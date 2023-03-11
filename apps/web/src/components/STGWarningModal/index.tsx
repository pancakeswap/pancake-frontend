import { useTranslation } from '@pancakeswap/localization'
import { ModalV2 } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'

import { useState, useCallback } from 'react'
import STGWarning from './STGWarning'

export function STGWarningModal({ openWarning }: { openWarning: boolean }) {
  const { t } = useTranslation()

  const [close, setClose] = useState(false)

  const handleSuccess = useCallback(() => {
    setClose(true)
  }, [])

  return (
    <ModalV2 isOpen={openWarning && !close} closeOnOverlayClick={false}>
      <DisclaimerModal
        id="stg-migration"
        modalHeader={t('Caution - Stargate Token')}
        header={<STGWarning />}
        checks={[
          {
            key: 'stg-understand',
            content: t('I understand'),
          },
        ]}
        onSuccess={handleSuccess}
      />
    </ModalV2>
  )
}
