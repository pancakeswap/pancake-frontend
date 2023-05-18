import {
  Box,
  ButtonMenu,
  ButtonMenuItem,
  Flex,
  UserMenu,
  UserMenuDivider,
  UserMenuItem,
  Text,
  NextLinkFromReactRouter,
  Message,
  MessageText,
} from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import {} from 'hooks/useSwitchNetwork'
import { ChainId } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Search from 'views/Info/components/InfoSearch'
import { useMultiChainPath, useChainNameByQuery, useChainIdByQuery } from 'state/info/hooks'
import { multiChainId, multiChainPaths } from 'state/info/constant'
import { chains } from 'utils/wagmi'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { bsc, mainnet } from 'wagmi/chains'
import { ASSET_CDN } from 'config/constants/endpoints'

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
  const chainId = useChainIdByQuery()
  const stableSwapQuery = isStableSwap ? '?type=stableSwap' : ''
  const activeIndex = useMemo(() => {
    if (router?.pathname?.includes('/pairs')) {
      return 1
    }
    if (router?.pathname?.includes('/tokens')) {
      return 2
    }
    return 0
  }, [router.pathname])
  return (
    <>
      <NavWrapper>
        <Flex>
          <Box>
            <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}${stableSwapQuery}`}>
                {t('Overview')}
              </ButtonMenuItem>
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}/pairs${stableSwapQuery}`}>
                {t('Pairs')}
              </ButtonMenuItem>
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}/tokens${stableSwapQuery}`}>
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
      {chainId === ChainId.BSC && !isStableSwap && (
        <Box maxWidth="1200px" m="0 auto">
          <Message my="24px" mx="24px" variant="warning">
            <MessageText fontSize="17px">
              <Text color="warning" as="span">
                {t(
                  'The markets for some of the newer and low-cap tokens displayed on the v2 info page are highly volatile, and as a result, token information may not be accurate.',
                )}
              </Text>
              <Text color="warning" ml="4px" bold as="span">
                {t('Before trading any token, please DYOR, and pay attention to the risk scanner.')}
              </Text>
            </MessageText>
          </Message>
        </Box>
      )}
    </>
  )
}

const targetChains = [mainnet, bsc]

export const NetworkSwitcher: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const { t } = useTranslation()
  const chainName = useChainNameByQuery()
  const foundChain = chains.find((d) => d.id === multiChainId[chainName])
  const symbol = foundChain?.nativeCurrency?.symbol
  const router = useRouter()
  const switchNetwork = useCallback(
    (chianId: number) => {
      const chainPath = multiChainPaths[chianId]
      if (activeIndex === 0) router.push(`/info${chainPath}`)
      if (activeIndex === 1) router.push(`/info${chainPath}/pairs`)
      if (activeIndex === 2) router.push(`/info${chainPath}/tokens`)
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
