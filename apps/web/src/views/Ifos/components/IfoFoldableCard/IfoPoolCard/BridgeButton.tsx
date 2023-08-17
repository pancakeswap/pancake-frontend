import { useTranslation } from '@pancakeswap/localization'
import { SpaceProps } from 'styled-system'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, useModalV2 } from '@pancakeswap/uikit'
import { useEffect } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'

// import { useChainNames } from '../../../hooks/useChainNames'
import { useIfoSourceChain } from '../../../hooks/useIfoSourceChain'
import { BRIDGE_STATE, useBridgeICake } from '../../../hooks/useBridgeICake'
import { BridgeICakeModal } from './BridgeICakeModal'

type Props = {
  ifoId: string

  ifoChainId: ChainId
  // The amount of icake on source chain
  icake?: CurrencyAmount<Currency>
  // The amount of icake on destination chain
  dstIcake?: CurrencyAmount<Currency>

  buttonVisible?: boolean
} & SpaceProps

export function BridgeButton({ ifoChainId, icake, dstIcake, buttonVisible = true, ifoId, ...props }: Props) {
  const { chainId } = useActiveChainId()
  const sourceChain = useIfoSourceChain()
  // const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const { state, bridge } = useBridgeICake({
    ifoId,
    icake,
    dstIcake,
    srcChainId: sourceChain,
    ifoChainId,
  })
  // const sourceChainName = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  // const ifoChainName = useChainNames([ifoChainId])
  const isCurrentChainSourceChain = chainId === sourceChain

  useEffect(() => {
    if (state.state !== BRIDGE_STATE.INITIAL) {
      onOpen()
    }
  }, [state.state, onOpen])

  return (
    <>
      <BridgeICakeModal
        icake={icake}
        isOpen={isOpen}
        onDismiss={onDismiss}
        sourceChainId={sourceChain}
        ifoChainId={ifoChainId}
        state={state}
        onBridge={bridge}
      />
      {buttonVisible && (
        <Button width="100%" id="bridge-icake" onClick={onOpen} {...props}>
          {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
        </Button>
      )}
    </>
  )
}
