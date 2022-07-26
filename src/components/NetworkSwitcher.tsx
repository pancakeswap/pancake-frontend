import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { bsc, bscTest } from '@pancakeswap/wagmi'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { setupNetwork } from 'utils/wallet'

const chains = [bsc, bscTest]

export const NetworkSelect = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => setupNetwork(chain.id)}>
          <Image width={24} height={24} src={`https://cdn.pancakeswap.com/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { chainId } = useActiveWeb3React()

  if (chainId === bscTest.id) {
    return (
      <UserMenu
        mr="8px"
        avatarSrc={`https://cdn.pancakeswap.com/chains/${chainId}.png`}
        account={bscTest.name}
        ellipsis={false}
      >
        {() => <NetworkSelect />}
      </UserMenu>
    )
  }

  return null
}
