import { useTranslation } from '@pancakeswap/localization'
// import { isNativeIfoSupported, PROFILE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/ifos'
import { SpaceProps } from 'styled-system'
// import { useMemo } from 'react'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, useModalV2 } from '@pancakeswap/uikit'

// import { useActiveChainId } from 'hooks/useActiveChainId'

// import { useChainNames } from '../../../hooks/useChainNames'
import { useIfoSourceChain } from '../../../hooks/useIfoSourceChain'
import { BridgeICakeModal } from './BridgeICakeModal'

type Props = {
  ifoChainId: ChainId
  // The amount of icake on source chain
  icake?: CurrencyAmount<Currency>
} & SpaceProps

export function BridgeButton({ ifoChainId, ...props }: Props) {
  // const { chainId } = useActiveChainId()
  const sourceChain = useIfoSourceChain()
  // const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  // const sourceChainName = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  // const ifoChainName = useChainNames([ifoChainId])

  return (
    <>
      <BridgeICakeModal isOpen={isOpen} onDismiss={onDismiss} sourceChainId={sourceChain} ifoChainId={ifoChainId} />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Bridge iCAKE')}
      </Button>
    </>
  )
}
