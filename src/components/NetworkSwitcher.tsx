import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { ChainId, NATIVE } from '@pancakeswap/sdk'
import useActiveWeb3React, { useNetworkConnectorUpdater } from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { useMemo } from 'react'
import { chains } from 'utils/wagmi'
import { ChainLogo } from './Logo/ChainLogo'

export const NetworkSelect = ({ switchNetwork }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork(chain.id)}>
          <ChainLogo chainId={chain.id} />
          <Image width={24} height={24} src={`/images/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, connector, chain, isWrongNetwork } = useActiveWeb3React()
  const { pendingChainId, isLoading, switchNetwork } = useSwitchNetwork()
  useNetworkConnectorUpdater()

  const foundChain = useMemo(
    () => chains.find((c) => c.id === (isLoading ? pendingChainId || chainId : chainId)),
    [isLoading, pendingChainId, chainId],
  )
  const symbol = NATIVE[foundChain?.id]?.symbol ?? foundChain?.nativeCurrency?.symbol

  const cannotChangeNetwork =
    connector?.id === 'walletConnect' ||
    (typeof window !== 'undefined' &&
      // @ts-ignore // TODO: add type later
      window.ethereum?.isSafePal)

  if (!chainId || chainId === ChainId.BSC) {
    return null
  }

  return (
    <>
      <UserMenu
        mr="8px"
        variant={isLoading ? 'pending' : chain?.unsupported || isWrongNetwork ? 'danger' : 'default'}
        avatarSrc={`/images/chains/${chainId}.png`}
        disabled={cannotChangeNetwork}
        text={
          isLoading ? (
            t('Requesting')
          ) : chain?.unsupported || isWrongNetwork ? (
            t('Network')
          ) : foundChain ? (
            <>
              <Box display={['none', null, null, null, null, 'block']}>{foundChain.name}</Box>
              <Box display={['block', null, null, null, null, 'none']}>{symbol}</Box>
            </>
          ) : (
            t('Select a Network')
          )
        }
      >
        {() => <NetworkSelect switchNetwork={switchNetwork} />}
      </UserMenu>
    </>
  )
}
