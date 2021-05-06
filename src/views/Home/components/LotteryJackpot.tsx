import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'

const LotteryJackpot = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {t('Coming Soon')}
      </Text>
      <br />
    </>
  )
}

export default LotteryJackpot
