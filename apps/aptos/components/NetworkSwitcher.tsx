import { ChainId } from '@pancakeswap/aptos-swap-sdk'
import { useNetwork } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { APEX_DOMAIN, ASSETS_CDN } from 'config'
import { defaultChain } from 'config/chains'
import Image from 'next/image'
import { aptosLogoClass } from './Logo/CurrencyLogo.css'

const evmChains = [
  { id: 56, name: 'BNB Chain', chainName: 'bsc' },
  { id: 1, name: 'Ethereum', chainName: 'eth' },
  { id: 324, name: 'zkSync Era', chainName: 'zkSync' },
  { id: 1101, name: 'Polygon zkEVM', chainName: 'polygonZkEVM' },
  { id: 42161, name: 'Arbitrum One', chainName: 'arb' },
  { id: 59144, name: 'Linea', chainName: 'linea' },
  { id: 8453, name: 'Base', chainName: 'base' },
  { id: 204, name: 'opBNB Mainnet', chainName: 'opBNB' },
]

const NetworkSelect = () => {
  const { t } = useTranslation()

  return (
    <>
      <Box px="16px" py="8px">
        <Text color="textSubtle">{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {evmChains.map((chain) => (
        <UserMenuItem
          key={chain.id}
          style={{ justifyContent: 'flex-start' }}
          as="a"
          target="_blank"
          href={`${APEX_DOMAIN}?chain=${chain.chainName}`}
        >
          <Image
            src={`${ASSETS_CDN}/web/chains/${chain.id}.png`}
            width={24}
            height={24}
            unoptimized
            alt={`chain-${chain.id}`}
          />
          <Text color="text" pl="12px">
            {chain.name}
          </Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const network = useNetwork() || defaultChain

  const { chain = defaultChain } = network

  const isMounted = useIsMounted()

  return (
    <UserMenu
      mr="8px"
      variant="default"
      avatarSrc="https://tokens.pancakeswap.finance/images/symbol/apt.png"
      avatarClassName={aptosLogoClass({
        isProduction: isMounted && chain?.id === ChainId.MAINNET,
      })}
      placement="bottom"
      text={
        <>
          <Box display={['none', null, null, null, null, 'block']}>
            {`Aptos${isMounted && chain?.testnet && chain?.name ? ` ${chain?.name}` : ''}`}
          </Box>
          <Box display={['block', null, null, null, null, 'none']}>APT</Box>
        </>
      }
    >
      {() => <NetworkSelect />}
    </UserMenu>
  )
}
