import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'
import Acknowledgement from './Acknowledgement'
import { DefaultWarningProps } from './types'

const SafemoonWarning: React.FC<DefaultWarningProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <>
      <Text mb="24px">
        {t('To trade SAFEMOON, you must click on the settings icon and set your slippage tolerance to 12%+')}
      </Text>
      <Text mb="24px">{t('This is because SafeMoon taxes a 10% fee on each transaction.')}</Text>
      <Text mb="12px">{t('• 5% fee = redistributed to all existing holders')}</Text>
      <Text mb="24px">{t('• 5% fee = used to add liquidity')}</Text>
      <Acknowledgement handleContinueClick={onDismiss} />
    </>
  )
}

export default SafemoonWarning
