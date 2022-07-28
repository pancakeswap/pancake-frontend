import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { chains } from 'utils/wagmi'
import { useSwitchNetwork } from 'wagmi'

export const NetworkSelect = () => {
  const { t } = useTranslation()
  const { switchNetwork } = useSwitchNetwork()
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
  const { chainId, account } = useActiveWeb3React()

  const chain = chains.find((c) => c.id === chainId)

  if (!account) {
    return null
  }

  return (
    <UserMenu
      mr="8px"
      avatarSrc={`https://cdn.pancakeswap.com/chains/${chainId}.png`}
      text={
        chain ? (
          <>
            <Box display={['none', null, null, null, null, 'block']}>{chain.name}</Box>
            <Box display={['block', null, null, null, null, 'none']}>{chain.nativeCurrency?.symbol}</Box>
          </>
        ) : (
          'Select a Network'
        )
      }
    >
      {() => <NetworkSelect />}
    </UserMenu>
  )
}
