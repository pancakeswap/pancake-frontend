import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import isEqual from 'lodash/isEqual'
import { useDidHide, useDidShow } from '@binance/mp-service'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, Image, LinkExternal, Card } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useLiquidity, LiquidityPage } from 'views/bmp/liquidity/liquidityContext'
import ErrorBoundary from 'components/ErrorBoundary'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import noLiquidityImage from '../../../public/images/no-liquidity.png'
import AddLiquidityTipImage from '../../images/add-liquidity-tip.png'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const Body = styled(CardBody)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
  min-height: 324px;
`

export const AddLiquidityTip = (props) => {
  const { t } = useTranslation()

  const { onPresent } = useTooltip(
    <view>
      <Text mb="10px">{t('impermanent-loss-tip-1')}</Text>
      <LinkExternal
        as="a"
        external
        href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
      >
        {t('impermanent-loss-tip-2')}
      </LinkExternal>
    </view>,
  )
  return (
    <Flex justifyContent="center" {...props}>
      <Text color="textSubtle" textAlign="center" mb="16px">
        {t(
          "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
        )}{' '}
        {t('add-liquidity-tip-1')}{' '}
        <Text onClick={onPresent} style={{ display: 'inline', textDecoration: 'underline dotted' }}>
          {' '}
          {t('add-liquidity-tip-2')}
        </Text>{' '}
        {t('add-liquidity-tip-3')}
      </Text>
    </Flex>
  )
}

let origin
const TrackedTokenHook = ({ account, setV2IsLoading, setAllV2PairsWithLiquidity }) => {
  const trackedTokenPairs = useTrackedTokenPairs()
  // fetch the user's balances of all tracked V2 LP tokens
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

  const allV2PairsWithLiquidity = useMemo(
    () => v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair)),
    [v2Pairs],
  )
  useEffect(() => {
    setV2IsLoading(v2IsLoading)
  }, [v2IsLoading])
  useEffect(() => {
    if (!isEqual(allV2PairsWithLiquidity, origin)) {
      setAllV2PairsWithLiquidity(allV2PairsWithLiquidity)
      origin = allV2PairsWithLiquidity
    }
  }, [allV2PairsWithLiquidity])

  return <></>
}

function Pool({ v2IsLoading, allV2PairsWithLiquidity }) {
  const { dispatch } = useLiquidity()
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const renderBody = () => {
    if (!account) {
      return (
        <view>
          <Flex justifyContent="center" mb="16px">
            <Image src={AddLiquidityTipImage} width={106} height={100} />
          </Flex>
          <AddLiquidityTip />
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
        {/* <Flex justifyContent="center" mb="16px"> */}
        {/*   <Image src={noLiquidityImage} width={97} height={100} /> */}
        {/* </Flex> */}
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
        </Text>
      </view>
    )
  }

  return (
    <ErrorBoundary name="pool">
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button
                id="import-pool-link"
                variant="secondary"
                scale="sm"
                as="a"
                mb=""
                onClick={() => {
                  dispatch({ type: 'setPage', page: LiquidityPage.Find })
                }}
              >
                {t('Find other LP tokens')}
              </Button>
              {(!allV2PairsWithLiquidity || allV2PairsWithLiquidity?.length === 0) && (
                <>
                  <Image src={AddLiquidityTipImage} width={106} height={100} mt="32px" mb="16px" />
                  <AddLiquidityTip />
                </>
              )}
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          {account && (
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
          )}
          {!account && <ConnectWalletButton width="100%" />}
        </CardFooter>
      </AppBody>
      {allV2PairsWithLiquidity?.length > 0 && (
        <Card mt="24px">
          <AddLiquidityTip mt="16px" mx="20px" />
        </Card>
      )}
    </ErrorBoundary>
  )
}

export default function PoolPage() {
  const { account } = useActiveWeb3React()
  const [visible, setVisible] = useState(false)
  const [v2IsLoading, setV2IsLoading] = useState(true)
  const [allV2PairsWithLiquidity, setAllV2PairsWithLiquidity] = useState()
  useDidHide(() => {
    setVisible(false)
  })
  useDidShow(() => {
    setVisible(true)
  })
  useEffect(() => {
    setVisible(true)
    return () => {
      setVisible(false)
    }
  }, [])
  return (
    <view>
      <Pool allV2PairsWithLiquidity={allV2PairsWithLiquidity} v2IsLoading={v2IsLoading} />
      {visible && (
        <TrackedTokenHook
          setAllV2PairsWithLiquidity={setAllV2PairsWithLiquidity}
          setV2IsLoading={setV2IsLoading}
          account={account}
        />
      )}
    </view>
  )
}
