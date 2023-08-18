import { useTranslation } from '@pancakeswap/localization'
import { SpaceProps } from 'styled-system'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useEffect } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

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
  const isCurrentChainSourceChain = chainId === sourceChain
  const { switchNetworkAsync } = useSwitchNetwork()
  const switchToSourceChain = useCallback(
    () => sourceChain && !isCurrentChainSourceChain && switchNetworkAsync(sourceChain),
    [sourceChain, switchNetworkAsync, isCurrentChainSourceChain],
  )
  // const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const { state, bridge } = useBridgeICake({
    ifoId,
    icake,
    dstIcake,
    srcChainId: sourceChain,
    ifoChainId,
    onUserReject: onDismiss,
  })
  // const sourceChainName = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  // const ifoChainName = useChainNames([ifoChainId])

  const onBridgeClick = useCallback(async () => {
    if (isCurrentChainSourceChain) {
      bridge()
      return
    }
    try {
      await switchToSourceChain()
    } catch (e) {
      console.error(e)
    }
  }, [isCurrentChainSourceChain, switchToSourceChain, bridge])

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
      />
      {buttonVisible && (
        <Button width="100%" id="bridge-icake" onClick={onBridgeClick} {...props}>
          {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
        </Button>
      )}
    </>
  )
}
