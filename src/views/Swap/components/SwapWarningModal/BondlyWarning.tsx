import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DefaultWarningProps } from './types'

const BondlyWarning: React.FC<DefaultWarningProps> = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Warning: BONDLY has been compromised. Please remove liqudity until further notice.')}</Text>
    </>
  )
}

export default BondlyWarning
