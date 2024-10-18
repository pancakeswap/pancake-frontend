import { useModal } from '@pancakeswap/uikit'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'

import { Currency, Price } from '@pancakeswap/sdk'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { memo } from 'react'

import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useIsWrapping } from '../../Swap/V3Swap/hooks'

interface Props {
  showSlippage?: boolean
  priceLoading?: boolean
  price?: Price<Currency, Currency>
}

export const PricingAndSlippage = memo(function PricingAndSlippage({
  priceLoading,
  price,
  showSlippage = true,
}: Props) {
  const [allowedSlippage] = useUserSlippage()
  const isWrapping = useIsWrapping()
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  if (isWrapping || !price) {
    return null
  }

  const priceNode = price ? (
    <>
      <SwapUIV2.TradePrice price={price} loading={priceLoading} />
    </>
  ) : null

  return (
    <SwapUIV2.SwapInfo
      price={priceNode}
      allowedSlippage={showSlippage ? allowedSlippage : undefined}
      onSlippageClick={onPresentSettingsModal}
    />
  )
})
