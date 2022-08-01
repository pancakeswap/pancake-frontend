import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { chains } from 'utils/wagmi'
import { CHAIN_IDS } from '@pancakeswap/wagmi'
import { useEffect } from 'react'

export const NetworkSelect = () => {
  const { t } = useTranslation()
  const switchNetwork = useSwitchNetwork()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  useEffect(() => {
    if (router.query.chainId !== String(chainId) && CHAIN_IDS.includes(chainId)) {
      router.replace({
        query: {
          ...router.query,
          chainId,
        },
      })
    }
  }, [chainId, router])

  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork(chain.id)}>
          <Image width={24} height={24} src={`https://cdn.pancakeswap.com/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, chain } = useActiveWeb3React()

  const isWrongNetwork = chain?.unsupported

  return (
    <UserMenu
      mr="8px"
      variant={isWrongNetwork ? 'danger' : 'default'}
      avatarSrc={`https://cdn.pancakeswap.com/chains/${chainId}.png`}
      text={
        isWrongNetwork ? (
          t('Network')
        ) : chain ? (
          <>
            <Box display={['none', null, null, null, null, 'block']}>{chain.name}</Box>
            <Box display={['block', null, null, null, null, 'none']}>{chain.nativeCurrency?.symbol}</Box>
          </>
        ) : (
          t('Select a Network')
        )
      }
    >
      {() => <NetworkSelect />}
    </UserMenu>
  )
}
