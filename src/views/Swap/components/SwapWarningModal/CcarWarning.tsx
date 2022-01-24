import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Link } from '@pancakeswap/uikit'

const CcarWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'Crypto Cars (CCAR) has been migrated to a new contract. Trading on the old contract may result in the complete loss of your assets. For more information please refer to',
        )}{' '}
        <Link style={{ display: 'inline' }} external href="https://t.me/Crypto_Cars_Official/465037">
          {t('the announcement.')}
        </Link>
      </Text>
    </>
  )
}

export default CcarWarning
