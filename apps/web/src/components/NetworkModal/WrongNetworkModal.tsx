import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Button, FlexGap, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import useAuth from 'hooks/useAuth'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Chain } from 'viem'
import { useAccount } from 'wagmi'
import * as allChains from 'viem/chains'
import { useCallback } from 'react'
import { queryChainIdAtom } from 'hooks/useActiveChainId'
import { useAtom } from 'jotai'
import { CHAIN_QUERY_NAME } from 'config/chains'
import Dots from '../Loader/Dots'

const getChain = (chainId: number | undefined) => {
  const chain = chainId ? Object.values(allChains).find((c) => c.id === chainId) : undefined

  return chain?.name || ''
}

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { logout } = useAuth()
  const { isConnected, chain, chainId: walletChainId } = useAccount()
  const [, setQueryChainId] = useAtom(queryChainIdAtom)
  const chainId = currentChain.id || ChainId.BSC
  const { t } = useTranslation()
  const router = useRouter()

  const switchText = t('Switch to %network%', { network: currentChain.name })

  const handleSwitchNetwork = useCallback(() => {
    if (canSwitch) {
      switchNetworkAsync(chainId)
    }
  }, [canSwitch, chainId, switchNetworkAsync])

  const handleLogout = useCallback(() => {
    logout().then(() => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            chain: CHAIN_QUERY_NAME[chainId],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
      setQueryChainId(chainId)
    })
  }, [chainId, logout, setQueryChainId, router])

  return (
    <Modal title={t('You are in wrong network')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <Grid style={{ gap: '16px' }} maxWidth={['100%', null, '336px']}>
        <Text>{t('This page is located for %network%.', { network: currentChain.name })}</Text>
        <Text>
          {t('You are under %network% now, please switch the network to continue.', {
            network: chain?.name ?? getChain(walletChainId) ?? '',
          })}
        </Text>
        <div style={{ textAlign: 'center' }}>
          <Image width={184} height={140} src="/images/decorations/3d-pan-bunny.png" alt="check your network" />
        </div>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText>
            <FlexGap gap="12px">
              <FlexGap gap="6px">
                {chain?.id && <ChainLogo chainId={chain?.id} />} <ArrowForwardIcon color="#D67E0A" />
                <ChainLogo chainId={chainId} />
              </FlexGap>
              <span>{t('Switch network to continue.')}</span>
            </FlexGap>
          </MessageText>
        </Message>
        {canSwitch ? (
          <Button isLoading={isLoading} onClick={handleSwitchNetwork}>
            {isLoading ? <Dots>{switchText}</Dots> : switchText}
          </Button>
        ) : (
          <Message variant="danger">
            <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
          </Message>
        )}
        {isConnected && (
          <Button onClick={handleLogout} variant="secondary">
            {t('Disconnect Wallet')}
          </Button>
        )}
      </Grid>
    </Modal>
  )
}
