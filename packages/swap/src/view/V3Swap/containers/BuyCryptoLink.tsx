import { Currency } from '@pancakeswap/sdk'
import React, { memo } from 'react'
import { Link, Row, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useActiveChainId } from '../../../hooks/useActiveChainId'
import { useCanBuyCrypto } from '../../hooks/useCanBuyCrypto'

interface Props {
  currency?: Currency | null
}

export const BuyCryptoLink = memo(function BuyCryptoInstruction({ currency }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const canBuyCrypto = useCanBuyCrypto({ chainId, currencySymbol: currency?.symbol })

  if (!currency || !canBuyCrypto) {
    return null
  }

  return (
    <Row alignItems="center" justifyContent="center" mb="4px">
      <Text fontSize="14px">
        {t('Insufficient Funds?')}{' '}
        <Link external href={`http://pancakeswap.finance/buy-crypto?inputCurrency=${currency.symbol}`}>
          {t('Buy Crypto here.')}
        </Link>
      </Text>
    </Row>
  )
})
