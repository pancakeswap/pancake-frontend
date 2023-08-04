import { useTranslation } from '@pancakeswap/localization'
import { isNativeIfoSupported, PROFILE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/ifos'
import { SpaceProps } from 'styled-system'
import { useMemo } from 'react'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, useModalV2 } from '@pancakeswap/uikit'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { NetworkSwitcherModal } from './NetworkSwitcherModal'
import { useChainNames } from '../../../hooks/useChainNames'

type Props = {
  ifoChainId: ChainId
  // The amount of icake on source chain
  icake?: CurrencyAmount<Currency>
} & SpaceProps

export function BridgeButton({ ifoChainId, ...props }: Props) {
  const { chainId } = useActiveChainId()
  const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const sourceChainName = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  const ifoChainName = useChainNames([ifoChainId])

  const button = !nativeIfoSupported ? (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={PROFILE_SUPPORTED_CHAIN_IDS}
        title={t('Bridge iCAKE')}
        description={t('Switch to %sourceChain% to bridge your iCAKE to participate this sale on %ifoChain%', {
          sourceChain: sourceChainName,
          ifoChain: ifoChainName,
        })}
        buttonText={t('Switch chain to bridge iCAKE')}
        onDismiss={onDismiss}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Bridge iCAKE')}
      </Button>
    </>
  ) : (
    <>
      <Button width="100%" {...props}>
        {t('Bridge iCAKE')}
      </Button>
    </>
  )

  return button
}
