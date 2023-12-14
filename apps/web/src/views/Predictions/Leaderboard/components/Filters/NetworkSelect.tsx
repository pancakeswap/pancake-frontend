import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { targetChains } from '@pancakeswap/prediction'
import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { ASSET_CDN } from 'config/constants/endpoints'
import React from 'react'
import { chains } from 'utils/wagmi'

interface NetworkSwitcherProps {
  pickedChainId: ChainId
  setPickedChainId: (chainId: ChainId) => void
}

export const NetworkSwitcher: React.FC<React.PropsWithChildren<NetworkSwitcherProps>> = ({
  pickedChainId,
  setPickedChainId,
}) => {
  const { t } = useTranslation()
  const foundChain = chains.find((d) => d.id === pickedChainId)
  const symbol = foundChain?.nativeCurrency?.symbol

  const switchNetwork = (value: ChainId) => {
    setPickedChainId(value)
  }

  return (
    <Box width={['100%', 'auto']}>
      <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
        {t('Network')}
      </Text>
      <UserMenu
        m={['0', '0', '0', '0', '-10px 0 0 0']}
        avatarSrc={`${ASSET_CDN}/web/chains/${pickedChainId}.png`}
        text={
          foundChain ? (
            <>
              <Box display={['none', null, null, null, null, 'block']}>{foundChain.name}</Box>
              <Box display={['block', null, null, null, null, 'none']}>{symbol}</Box>
            </>
          ) : (
            t('Select a Network')
          )
        }
        recalculatePopover
      >
        {() => (
          <>
            <Box px="16px" py="8px">
              <Text color="textSubtle">{t('Select a Network')}</Text>
            </Box>
            <UserMenuDivider />
            {targetChains.map((chain) => (
              <UserMenuItem
                key={chain.id}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  if (chain.id !== pickedChainId) {
                    switchNetwork(chain.id)
                  }
                }}
              >
                <ChainLogo chainId={chain.id} />
                <Text
                  color={chain.id === pickedChainId ? 'secondary' : 'text'}
                  bold={chain.id === pickedChainId}
                  pl="12px"
                >
                  {chain.name}
                </Text>
              </UserMenuItem>
            ))}
          </>
        )}
      </UserMenu>
    </Box>
  )
}
