import { Swap as SwapUI, useModal, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Price, Currency } from '@pancakeswap/sdk'

import { useUserSlippageTolerance } from 'state/user/hooks'

import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../../components/Menu/GlobalSettings/types'
import { useIsWrapping } from '../hooks'

interface Props {
  priceLoading?: boolean
  price?: Price<Currency, Currency>
}

export function PricingAndSlippage({ priceLoading, price }: Props) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()
  const isWrapping = useIsWrapping()
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  if (isWrapping) {
    return null
  }

  const priceContent = priceLoading ? (
    <Skeleton width="80%" ml="8px" height="24px" />
  ) : (
    <SwapUI.TradePrice price={price} />
  )
  const priceNode = price ? (
    <>
      <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
      {priceContent}
    </>
  ) : null

  return <SwapUI.Info price={priceNode} allowedSlippage={allowedSlippage} onSlippageClick={onPresentSettingsModal} />
}
