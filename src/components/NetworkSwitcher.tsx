import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { bsc, bscTest } from '@pancakeswap/wagmi'
import { mainnet, rinkeby } from 'wagmi/chains'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { setupNetwork } from 'utils/wallet'

// const chains = [bsc, mainnet]
const chains = [bsc, bscTest, mainnet, rinkeby]

export const NetworkSelect = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem
          key={chain.id}
          style={{ justifyContent: 'flex-start' }}
          onClick={() =>
            setupNetwork(chain.id, {
              chainId: chain.id,
              chanName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls.default,
              blockExplorerUrls: chain.blockExplorers.default,
            })
          }
        >
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
      account={chain ? chain.name : 'Select a Network'}
      ellipsis={false}
    >
      {() => <NetworkSelect />}
    </UserMenu>
  )
}
