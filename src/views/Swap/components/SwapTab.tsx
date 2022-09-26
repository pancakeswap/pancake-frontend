import { useState } from 'react'
import { TabMenu, Tab } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export enum SwapType {
  SWAP,
  STABLE_SWAP,
}

export default function SwapTab({ children, showStable }) {
  const { t } = useTranslation()
  const [swapTypeState, setSwapType] = useState(SwapType.SWAP)

  if (showStable) {
    return (
      <>
        <TabMenu
          fullWidth
          activeIndex={swapTypeState}
          onItemClick={() => setSwapType((state) => (state === SwapType.SWAP ? SwapType.STABLE_SWAP : SwapType.SWAP))}
        >
          <Tab>{t('Swap')}</Tab>
          <Tab>{t('StableSwap')}</Tab>
        </TabMenu>
        {children(swapTypeState)}
      </>
    )
  }

  return children(SwapType.SWAP)
}
