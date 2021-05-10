import React from 'react'
import { Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'

const WalletNotConnected = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Heading size="xl" mb="8px">
        {t('Oops!')}
      </Heading>
      <Text as="p" mb="16px">
        {t('Please connect your wallet to continue')}
      </Text>
      <UnlockButton />
    </div>
  )
}

export default WalletNotConnected
