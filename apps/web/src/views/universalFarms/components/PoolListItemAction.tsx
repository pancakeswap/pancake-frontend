import { getChainName } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { Box, Button, MoreIcon, SubMenu } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { memo, useCallback, useMemo } from 'react'
import type { PoolInfo } from 'state/farmsV4/state/type'
import { multiChainPaths } from 'state/info/constant'
import styled, { css } from 'styled-components'
import { isAddressEqual } from 'viem'
import { useAccount } from 'wagmi'

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <Box onClick={handleClick}>
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
    </Box>
  )
})

export const ActionItems = ({ pool, icon }: { pool: PoolInfo; icon?: React.ReactNode }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const stablePair = useMemo(
    () =>
      LegacyRouter.stableSwapPairsByChainId[pool.chainId]?.find((pair) =>
        isAddressEqual(pair.lpAddress, pool.lpAddress),
      ),
    [pool.chainId, pool.lpAddress],
  )

  const { infoLink, detailLink, addLiquidityLink } = useMemo(() => {
    const addLiqLink = `/add/${pool.token0.wrapped.address}/${pool.token1.address}?chain=${
      CHAIN_QUERY_NAME[pool.chainId]
    }`

    if (pool.protocol === Protocol.STABLE) {
      return {
        infoLink: `/info${multiChainPaths[pool.chainId]}/pairs/${stablePair?.stableSwapAddress}?type=stableSwap&chain=${
          CHAIN_QUERY_NAME[pool.chainId]
        }`,
        detailLink: `/pools/${getChainName(pool.chainId)}/${stablePair?.stableSwapAddress}`,
        addLiquidityLink: addLiqLink,
      }
    }
    return {
      infoLink: `/info/${pool.protocol}${multiChainPaths[pool.chainId]}/pairs/${pool.lpAddress}?chain=${
        CHAIN_QUERY_NAME[pool.chainId]
      }`,
      detailLink: `/pools/${getChainName(pool.chainId)}/${pool.lpAddress}`,
      addLiquidityLink: addLiqLink,
    }
  }, [pool, stablePair?.stableSwapAddress])

  return (
    <>
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
    </>
  )
}
