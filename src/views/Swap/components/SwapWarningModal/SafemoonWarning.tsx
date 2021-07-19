import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'

const SafemoonWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('To trade SAFEMOON, you must:')} </Text>
      <Text>• {t('Click on the settings icon')}</Text>
      <Text mb="24px">• {t('Set your slippage tolerance to 12%+')}</Text>
      <Text>{t('This is because SafeMoon taxes a 10% fee on each transaction:')}</Text>
      <Text>• {t('5% fee = redistributed to all existing holders')}</Text>
      <Text>• {t('5% fee = used to add liquidity')}</Text>
    </>
  )
}

export default SafemoonWarning
