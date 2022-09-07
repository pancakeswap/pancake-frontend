import { Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import useAuth from 'hooks/useAuth'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { useRouter } from 'next/router'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import Dots from '../Loader/Dots'

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal() {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chains } = useNetwork()
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

  const supportedMainnetChains = useMemo(() => chains.filter((chain) => !chain.testnet), [chains])

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradientCardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>
          {t('Currently %feature% only supported in', { feature: typeof title === 'string' ? title : 'this page' })}{' '}
          {supportedMainnetChains?.map((c) => c.name).join(', ')}
        </Text>
        <div style={{ textAlign: 'center' }}>
          <Image
            layout="fixed"
            width="194px"
            height="175px"
            src="/images/check-your-network.png"
            alt="check your network"
          />
        </div>
        <Message variant="warning">
          <MessageText>{t('Please switch your network to continue.')}</MessageText>
        </Message>
        {canSwitch && (
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (supportedMainnetChains.map((c) => c.id).includes(chainId)) {
                switchNetworkAsync(chainId)
              } else {
                switchNetworkAsync(supportedMainnetChains[0].id)
              }
            }}
          >
            {isLoading ? <Dots>{t('Switch network in wallet')}</Dots> : t('Switch network in wallet')}
          </Button>
        )}
        {isConnected && (
          <Button variant="secondary" onClick={logout}>
            {t('Disconnect Wallet')}
          </Button>
        )}
      </Grid>
    </Modal>
  )
}
