import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'

const SafemoonWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('SAFEMOON decides to update their token smart contract with V2')} </Text>
      <Text>
        • {t('Please check their Twitter(@safemoon) before trade, you can lose your assets completely via trading')}
      </Text>
    </>
  )
}

export default SafemoonWarning
