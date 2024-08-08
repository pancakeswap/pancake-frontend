import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'
import { useHistory } from 'contexts/HistoryContext'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useAuth from 'hooks/useAuth'
import { useSwitchNetwork, useSwitchNetworkLocal } from 'hooks/useSwitchNetwork'
// eslint-disable-next-line no-restricted-imports
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { chains } from 'utils/wagmi'

export function PageNetworkSupportModal() {
  const { t } = useTranslation()
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const { chainId, isConnected, isWrongNetwork } = useActiveWeb3React()
  const { logout } = useAuth()

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])
  const historyManager = useHistory()

  const lastValidPath = historyManager?.history?.find((h) => ['/'].includes(h))

  const menuItems = useMenuItems()
  const { pathname, push } = useRouter()

  const { title, image } = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

    return {
      title: activeSubMenuItem?.disabled ? activeSubMenuItem?.label : activeMenuItem?.label,
      image: activeSubMenuItem?.image || activeMenuItem?.image,
    }
  }, [menuItems, pathname])

  return (
    <Modal title={title || t('Check your network')} hideCloseButton headerBackground="gradientCardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="360px">
        <Text bold>{t('It’s a BNB Smart Chain only feature')}</Text>

        {image && (
          <Box mx="auto" my="8px" position="relative" width="100%" minHeight="250px">
            <Image src={image} alt="feature" fill style={{ objectFit: 'contain' }} unoptimized />
          </Box>
        )}
        <Text small>
          {t('Features are currently available only on BNB Chain! Come over and join the community in the fun!')}
        </Text>
        {canSwitch ? (
          <Button
            variant={foundChain && lastValidPath ? 'secondary' : 'primary'}
            isLoading={isLoading}
            onClick={() => (isWrongNetwork ? switchNetworkLocal(ChainId.BSC) : switchNetworkAsync(ChainId.BSC))}
          >
            {t('Switch to %chain%', { chain: 'BNB Chain' })}
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
                push('/')
              })
            }
          >
            {t('Disconnect Wallet')}
          </Button>
        )}
        {foundChain && lastValidPath && (
          <NextLink href={lastValidPath ?? ''} passHref>
            <Button width="100%">{t('Stay on %chain%', { chain: foundChain.name })}</Button>
          </NextLink>
        )}
      </Grid>
    </Modal>
  )
}
