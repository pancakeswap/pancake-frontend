import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import {
  Box,
  ButtonMenu,
  ButtonMenuItem,
  Flex,
  Text,
  UserMenu,
  UserMenuDivider,
  UserMenuItem,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { ChainLogo } from 'components/Logo/ChainLogo'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { multiChainId, multiChainPaths, multiChainShortName } from 'state/info/constant'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { arbitrum, bsc, mainnet, polygonZkEvm, zkSync, linea, base, opBNB } from 'wagmi/chains'
import { v3InfoPath } from '../../constants'
import Search from '../Search'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  justify-content: space-between;
  padding: 20px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
    flex-direction: row;
  }
`

const InfoNav: React.FC<{ isStableSwap: boolean }> = ({ isStableSwap }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const chainPath = useMultiChainPath()
  const activeIndex = useMemo(() => {
    if (router?.pathname?.includes('/pairs')) {
      return 1
    }
    if (router?.pathname?.includes('/tokens')) {
      return 2
    }
    return 0
  }, [router.pathname])
  const stableSwapQuery = isStableSwap ? '?type=stableSwap' : ''
  return (
    <NavWrapper>
      <Flex>
        <Box>
          <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
            <ButtonMenuItem as={NextLinkFromReactRouter} to={`/${v3InfoPath}${chainPath}${stableSwapQuery}`}>
              {t('Overview')}
            </ButtonMenuItem>
            <ButtonMenuItem as={NextLinkFromReactRouter} to={`/${v3InfoPath}${chainPath}/pairs${stableSwapQuery}`}>
              {t('Pairs')}
            </ButtonMenuItem>
            <ButtonMenuItem as={NextLinkFromReactRouter} to={`/${v3InfoPath}${chainPath}/tokens${stableSwapQuery}`}>
              {t('Tokens')}
            </ButtonMenuItem>
          </ButtonMenu>
        </Box>
        <NetworkSwitcher activeIndex={activeIndex} />
      </Flex>
      <Box width={['100%', '100%', '250px']}>
        <Search />
      </Box>
    </NavWrapper>
  )
}

const targetChains = [mainnet, bsc, polygonZkEvm, zkSync, arbitrum, linea, base, opBNB]

export const NetworkSwitcher: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const { t } = useTranslation()
  const chainName = useChainNameByQuery()
  const foundChain = chains.find((d) => d.id === multiChainId[chainName])
  const symbol = multiChainShortName[foundChain?.id ?? -1] ?? foundChain?.nativeCurrency?.symbol
  const router = useRouter()
  const switchNetwork = useCallback(
    (chianId: number) => {
      const chainPath = multiChainPaths[chianId]
      if (activeIndex === 0) router.push(`/${v3InfoPath}${chainPath}`)
      if (activeIndex === 1) router.push(`/${v3InfoPath}${chainPath}/pairs`)
      if (activeIndex === 2) router.push(`/${v3InfoPath}${chainPath}/tokens`)
    },
    [router, activeIndex],
  )

  return (
    <UserMenu
      alignItems="top"
      ml="8px"
      avatarSrc={`${ASSET_CDN}/web/chains/${multiChainId[chainName]}.png`}
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
      {() => <NetworkSelect chainId={multiChainId[chainName]} switchNetwork={switchNetwork} />}
    </UserMenu>
  )
}

const NetworkSelect: React.FC<{ chainId: ChainId; switchNetwork: (chainId: number) => void }> = ({
  switchNetwork,
  chainId,
}) => {
  const { t } = useTranslation()

  return (
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
            if (chain.id !== chainId) switchNetwork(chain.id)
          }}
        >
          <ChainLogo chainId={chain.id} />
          <Text color={chain.id === chainId ? 'secondary' : 'text'} bold={chain.id === chainId} pl="12px">
            {chain.name}
          </Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export default InfoNav
