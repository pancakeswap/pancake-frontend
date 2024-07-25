import { useTranslation } from '@pancakeswap/localization'
import { Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useSwitchNetwork, useSwitchNetworkLocal } from 'hooks/useSwitchNetwork'
// eslint-disable-next-line no-restricted-imports
import { ChainId } from '@pancakeswap/chains'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'
import useAuth from 'hooks/useAuth'
// eslint-disable-next-line no-restricted-imports
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { viemClients } from 'utils/viem'
import { useAccount } from 'wagmi'
import Dots from '../Loader/Dots'

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal({ pageSupportedChains }: { pageSupportedChains: number[] }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const chainId = useLocalNetworkChain() || ChainId.BSC
  const { isConnected } = useAccount()
  const { logout } = useAuth()
  const { t } = useTranslation()
  const menuItems = useMenuItems()
  const { pathname } = useRouter()

  const title = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

    return activeSubMenuItem?.label || activeMenuItem?.label
  }, [menuItems, pathname])

  const supportedMainnetChains = useMemo(
    () =>
      Object.values(viemClients)
        .map((client) => client.chain)
        .filter((chain) => chain && !chain.testnet && pageSupportedChains?.includes(chain.id)),
    [pageSupportedChains],
  )

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradientCardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>
          {t('Currently %feature% only supported in', { feature: typeof title === 'string' ? title : 'this page' })}{' '}
          {supportedMainnetChains?.map((c) => c?.name).join(', ')}
        </Text>
        <div style={{ textAlign: 'center' }}>
          <Image
            layout="fixed"
            width={194}
            height={175}
            src="/images/check-your-network.png"
            alt="check your network"
          />
        </div>
        <Message variant="warning">
          <MessageText>{t('Please switch your network to continue.')}</MessageText>
        </Message>
        {canSwitch ? (
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (supportedMainnetChains.map((c) => c?.id).includes(chainId)) {
                switchNetworkAsync(chainId)
              } else {
                switchNetworkAsync(ChainId.BSC)
              }
            }}
          >
            {isLoading ? (
              <Dots>{isConnected ? t('Switch network in wallet') : t('Switch network')}</Dots>
            ) : isConnected ? (
              t('Switch network in wallet')
            ) : (
              t('Switch network')
            )}
          </Button>
        ) : (
          <Message variant="danger">
            <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
          </Message>
        )}
        {isConnected && (
          <Button
            variant="secondary"
            onClick={() =>
              logout().then(() => {
                switchNetworkLocal(ChainId.BSC)
              })
            }
          >
            {t('Disconnect Wallet')}
          </Button>
        )}
      </Grid>
    </Modal>
  )
}
