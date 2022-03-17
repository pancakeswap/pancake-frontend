import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useLiquidity, LiquidityPage } from 'views/BmpHome/context/swapContext.bmp'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import noLiquidityImage from '../../../public/images/no-liquidity.png'

const Body = styled(CardBody)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
  min-height: 324px;
`

export default function Pool() {
  const { dispatch } = useLiquidity()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <view>
          <Flex justifyContent="center">
            <Text color="textSubtle" textAlign="center" width="180px" mb="16px">
              {t('Connect to a wallet to view your liquidity.')}
            </Text>
          </Flex>
          <ConnectWalletButton width="100%" />
        </view>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <view>
        <Flex justifyContent="center" mb="16px">
          <Image src={noLiquidityImage} width={97} height={100} />
        </Flex>
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
        </Text>
      </view>
    )
  }

  return (
    <AppBody>
      <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
      <Body>
        {renderBody()}
        {account && !v2IsLoading && (
          <Flex flexDirection="column" alignItems="center" mt="24px">
            <Text color="textSubtle" mb="8px">
              {t("Don't see a pool you joined?")}
            </Text>
            {/* <Link href="/find"> */}
            <Button
              id="import-pool-link"
              variant="secondary"
              scale="sm"
              as="a"
              onClick={() => {
                dispatch({ type: 'setPage', page: LiquidityPage.Find })
              }}
            >
              {t('Find other LP tokens')}
            </Button>
            {/* </Link> */}
          </Flex>
        )}
      </Body>
      <CardFooter style={{ textAlign: 'center' }}>
        {/* <Link href="/add"> */}
        <Button
          disabled={!account}
          id="join-pool-button"
          width="100%"
          startIcon={<AddIcon color="white" />}
          onClick={() => {
            dispatch({ type: 'setPage', page: LiquidityPage.Add })
          }}
        >
          {t('Add Liquidity')}
        </Button>
        {/* </Link> */}
      </CardFooter>
    </AppBody>
  )
}
