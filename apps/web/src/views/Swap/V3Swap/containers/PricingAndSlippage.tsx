import { Swap as SwapUI, useModal } from '@pancakeswap/uikit'

import { useUserSlippageTolerance } from 'state/user/hooks'

import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../../components/Menu/GlobalSettings/types'
import { useIsWrapping } from '../hooks'

export function PricingAndSlippage() {
  const [allowedSlippage] = useUserSlippageTolerance()
  const isWrapping = useIsWrapping()
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  if (isWrapping) {
    return null
  }

  return <SwapUI.Info price={null} allowedSlippage={allowedSlippage} onSlippageClick={onPresentSettingsModal} />
}
