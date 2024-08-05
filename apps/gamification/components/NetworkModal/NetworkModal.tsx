import { ChainId } from '@pancakeswap/chains'
import { ModalV2 } from '@pancakeswap/uikit'
import { SUPPORT_ONLY_BSC } from 'config/supportedChain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { atom, useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import { viemClients } from 'utils/viem'
import { CHAIN_IDS } from 'utils/wagmi'

export const hideWrongNetworkModalAtom = atom(false)

const PageNetworkSupportModal = dynamic(
  () => import('./PageNetworkSupportModal').then((mod) => mod.PageNetworkSupportModal),
  { ssr: false },
)
const WrongNetworkModal = dynamic(() => import('./WrongNetworkModal').then((mod) => mod.WrongNetworkModal), {
  ssr: false,
})
const UnsupportedNetworkModal = dynamic(
  () => import('./UnsupportedNetworkModal').then((mod) => mod.UnsupportedNetworkModal),
  { ssr: false },
)

export const NetworkModal = ({ pageSupportedChains = SUPPORT_ONLY_BSC }: { pageSupportedChains?: number[] }) => {
  const { chainId, chain, isWrongNetwork } = useActiveWeb3React()
  const [dismissWrongNetwork, setDismissWrongNetwork] = useAtom(hideWrongNetworkModalAtom)

  const isBNBOnlyPage = useMemo(() => {
    return pageSupportedChains?.length === 1 && pageSupportedChains[0] === ChainId.BSC
  }, [pageSupportedChains])

  const isPageNotSupported = useMemo(
    () => Boolean(pageSupportedChains.length) && chainId && !pageSupportedChains.includes(chainId),
    [chainId, pageSupportedChains],
  )
  const handleDismiss = useCallback(() => setDismissWrongNetwork(true), [setDismissWrongNetwork])

  if (pageSupportedChains?.length === 0) return null // open to all chains

  if (isPageNotSupported && isBNBOnlyPage) {
    return (
      <ModalV2 isOpen closeOnOverlayClick={false}>
        <PageNetworkSupportModal />
      </ModalV2>
    )
  }

  if (isWrongNetwork && !dismissWrongNetwork && !isPageNotSupported) {
    const currentChain = Object.values(viemClients)
      .map((client) => client.chain)
      .find((c) => c?.id === chainId)
    if (!currentChain) return null
    return (
      <ModalV2 isOpen={isWrongNetwork} closeOnOverlayClick={false} onDismiss={handleDismiss}>
        <WrongNetworkModal currentChain={currentChain} onDismiss={handleDismiss} />
      </ModalV2>
    )
  }

  if ((chain?.unsupported ?? false) || isPageNotSupported) {
    return (
      <ModalV2 isOpen closeOnOverlayClick={false}>
        <UnsupportedNetworkModal pageSupportedChains={pageSupportedChains?.length ? pageSupportedChains : CHAIN_IDS} />
      </ModalV2>
    )
  }

  return null
}
