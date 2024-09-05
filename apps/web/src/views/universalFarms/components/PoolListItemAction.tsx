import { Protocol } from '@pancakeswap/farms'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { Button, Flex, MoreIcon, SubMenu } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { memo, useCallback, useMemo } from 'react'
import type { PoolInfo } from 'state/farmsV4/state/type'
import { multiChainPaths } from 'state/info/constant'
import styled, { css } from 'styled-components'
import { isAddressEqual } from 'viem'
import { useAccount } from 'wagmi'
import { PERSIST_CHAIN_KEY } from 'config/constants'
import { addQueryToPath } from 'utils/addQueryToPath'

const BaseButtonStyle = css`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  padding: 8px 16px;
  line-height: 24px;
  height: auto;
  justify-content: flex-start;
`
const StyledButton = styled(Button)`
  ${BaseButtonStyle}
`

const StyledConnectWalletButton = styled(ConnectWalletButton)`
  ${BaseButtonStyle}
`

export const PoolListItemAction = memo(({ pool }: { pool: PoolInfo }) => {
  const { theme } = useTheme()

  return (
    <SubMenu
      style={{
        background: theme.card.background,
        borderColor: theme.colors.cardBorder,
      }}
      component={
        <Button scale="xs" variant="text">
          <MoreIcon />
        </Button>
      }
    >
      <ActionItems pool={pool} />
    </SubMenu>
  )
})

export const getPoolDetailPageLink = (pool: PoolInfo) => {
  const linkPrefix = `/liquidity/pool${multiChainPaths[pool.chainId] || '/bsc'}`
  if (pool.protocol === Protocol.STABLE) {
    if (pool.stableSwapAddress) {
      return `${linkPrefix}/${pool.stableSwapAddress}`
    }
    const ssPair = LegacyRouter.stableSwapPairsByChainId[pool.chainId]?.find((pair) => {
      return isAddressEqual(pair.lpAddress, pool.lpAddress)
    })
    if (ssPair) {
      return `${linkPrefix}/${ssPair.stableSwapAddress}`
    }
  }
  return `${linkPrefix}/${pool.lpAddress}`
}

const getPoolInfoPageLink = (pool: PoolInfo) => {
  const toLink = (lpAddress: string, protocol: string, query: string = '') => {
    return `/info/${protocol}${multiChainPaths[pool.chainId]}/pairs/${lpAddress}?${query}`
  }
  if (pool.protocol === Protocol.STABLE) {
    const ssPair = LegacyRouter.stableSwapPairsByChainId[pool.chainId]?.find((pair) => {
      return isAddressEqual(pair.lpAddress, pool.lpAddress)
    })
    if (ssPair) {
      return toLink(ssPair.stableSwapAddress, '', 'type=stableSwap')
    }
  }
  return toLink(pool.lpAddress, pool.protocol)
}

export const ActionItems = ({ pool, icon }: { pool: PoolInfo; icon?: React.ReactNode }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const { infoLink, detailLink, addLiquidityLink } = useMemo(() => {
    const addLiqLink = addQueryToPath(`/add/${pool.token0.wrapped.address}/${pool.token1.address}`, {
      chain: CHAIN_QUERY_NAME[pool.chainId],
      [PERSIST_CHAIN_KEY]: '1',
    })
    return {
      infoLink: getPoolInfoPageLink(pool),
      detailLink: getPoolDetailPageLink(pool),
      addLiquidityLink: addLiqLink,
    }
  }, [pool])

  const stopBubble = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Flex flexDirection="column" onClick={stopBubble}>
      <NextLinkFromReactRouter to={detailLink}>
        <StyledButton scale="sm" variant="text">
          {t('View Pool Details')}
          {icon}
        </StyledButton>
      </NextLinkFromReactRouter>
      {!account ? (
        <StyledConnectWalletButton scale="sm" variant="text" />
      ) : (
        <NextLinkFromReactRouter to={addLiquidityLink}>
          <StyledButton scale="sm" variant="text">
            {t('Add Liquidity')}
            {icon}
          </StyledButton>
        </NextLinkFromReactRouter>
      )}
      <NextLinkFromReactRouter to={infoLink}>
        <StyledButton scale="sm" variant="text">
          {t('View Info Page')}
          {icon}
        </StyledButton>
      </NextLinkFromReactRouter>
    </Flex>
  )
}
