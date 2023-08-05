import { useTranslation } from '@pancakeswap/localization'
import { useAccount } from 'wagmi'
import { getBridgeICakeGasFee, getCrossChainMessage } from '@pancakeswap/ifos'
import { SpaceProps } from 'styled-system'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { useCallback } from 'react'
import { Button, useModalV2 } from '@pancakeswap/uikit'

// import { useActiveChainId } from 'hooks/useActiveChainId'
import { getViemClients } from 'utils/viem'

// import { useChainNames } from '../../../hooks/useChainNames'
import { useIfoSourceChain } from '../../../hooks/useIfoSourceChain'
import { useBridgeICake } from '../../../hooks/useBridgeICake'
import { BridgeICakeModal } from './BridgeICakeModal'

type Props = {
  ifoChainId: ChainId
  // The amount of icake on source chain
  icake?: CurrencyAmount<Currency>
} & SpaceProps

export function BridgeButton({ ifoChainId, icake, ...props }: Props) {
  // const { chainId } = useActiveChainId()
  const sourceChain = useIfoSourceChain()
  // const nativeIfoSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const { state } = useBridgeICake()
  const { address: account } = useAccount()
  // const sourceChainName = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  // const ifoChainName = useChainNames([ifoChainId])
  const onBridge = useCallback(async () => {
    if (!account) {
      return
    }

    const gasEstimate = await getBridgeICakeGasFee({
      srcChainId: sourceChain,
      dstChainId: ifoChainId,
      account,
      provider: getViemClients,
    })
    const message = await getCrossChainMessage({
      chainId: ChainId.BSC,
      txHash: '0x54b077aa600b0f9f4a7c29ef3137fcbd3ccf11d429797b397987293373413680',
    })
    console.log(gasEstimate.toExact(), message)
  }, [account, sourceChain, ifoChainId])

  return (
    <>
      <BridgeICakeModal
        icake={icake}
        isOpen={isOpen}
        onDismiss={onDismiss}
        sourceChainId={sourceChain}
        ifoChainId={ifoChainId}
        state={state}
        onBridge={onBridge}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Bridge iCAKE')}
      </Button>
    </>
  )
}
