import React from 'react'
import { Button, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const WalletWrongNetwork: React.FC = () => {
  const { t } = useTranslation()

  const handleOnClick = (): void => {
    const url = 'https://docs.pancakeswap.finance/get-started/connection-guide'
    window.open(url)
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      <Button onClick={handleOnClick} mb="24px" variant="subtle">
        {t('Learn How')}
      </Button>
    </>
  )
}

export default WalletWrongNetwork
