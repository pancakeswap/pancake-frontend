import { useTranslation } from '@pancakeswap/localization'
import { SpaceProps } from 'styled-system'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, useModalV2, Loading } from '@pancakeswap/uikit'
import { useCallback, useEffect, useState } from 'react'

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
  const sourceChain = useIfoSourceChain(ifoChainId)
  const isCurrentChainSourceChain = chainId === sourceChain
  const [isSwitching, setIsSwitching] = useState(false)
  const { switchNetworkAsync } = useSwitchNetwork()
  const switchToSourceChain = useCallback(
    () => sourceChain && !isCurrentChainSourceChain && switchNetworkAsync(sourceChain),
    [sourceChain, switchNetworkAsync, isCurrentChainSourceChain],
  )
  // const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const { state, bridge, isBridging, isBridged, clearBridgeHistory } = useBridgeICake({
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
      setIsSwitching(true)
      await switchToSourceChain()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSwitching(false)
    }
  }, [isCurrentChainSourceChain, switchToSourceChain, bridge])

  const onModalDismiss = useCallback(() => {
    if (isBridged) {
      clearBridgeHistory()
    }
    return onDismiss()
  }, [onDismiss, isBridged, clearBridgeHistory])

  useEffect(() => {
    if (state.state !== BRIDGE_STATE.INITIAL) {
      onOpen()
    }
  }, [state.state, onOpen])

  const loading = isSwitching || isBridging

  return (
    <>
      <BridgeICakeModal
        icake={icake}
        isOpen={isOpen}
        onDismiss={onModalDismiss}
        sourceChainId={sourceChain}
        ifoChainId={ifoChainId}
        state={state}
      />
      {buttonVisible && (
        <Button width="100%" id="bridge-icake" disabled={loading} onClick={onBridgeClick} {...props}>
          {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
          {loading && <Loading width="1rem" height="1rem" ml="0.5rem" />}
        </Button>
      )}
    </>
  )
}
