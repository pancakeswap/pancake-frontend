import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, CardBody, CardFooter, Dots, Flex, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import styled from 'styled-components'
// import FullPositionCard, { StableFullPositionCard } from '../../components/PositionCard'
// import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { PAIR_LP_TYPE_TAG, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import { COIN_STORE_TYPE_PREFIX, unwrapStrutTagTypeArgFromString } from '@pancakeswap/awgmi/core'
import { PairState, usePairsFromAddresses } from 'hooks/usePairs'
// import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
// import { AppHeader, AppBody } from '../../components/App'
// import Page from '../Page'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export default function Pool() {
  const { account } = useAccount()
  const address = account?.address

  const { t } = useTranslation()

  const { data: v2PairsBalances, isFetching: fetchingV2PairBalances } = useAccountResources({
    watch: true,
    address,
    select(data) {
      const lps = data.filter((d) => d.type.includes(`${COIN_STORE_TYPE_PREFIX}<${PAIR_LP_TYPE_TAG}`))
      return lps
    },
  })

  // const [v2PairsBalances, fetchingV2PairBalances] = useCurrencyBalancesWithLoading(liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  // const liquidityTokensWithBalances = useMemo(
  //   () =>
  //     tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
  //       v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
  //     ),
  //   [tokenPairsWithLiquidityTokens, v2PairsBalances],
  // )

  const v2Pairs = usePairsFromAddresses(
    (v2PairsBalances
      ?.map((p) => `${PAIR_RESERVE_TYPE_TAG}<${unwrapStrutTagTypeArgFromString(p.type)}>`)
      .filter(Boolean) as string[]) ?? [],
  )

  // const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!address) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    const positionCards = []
    // TODO: position cards
    // if (allV2PairsWithLiquidity?.length > 0) {
    //   positionCards = allV2PairsWithLiquidity.map((v2Pair, index) => (
    //     <FullPositionCard
    //       key={v2Pair.liquidityToken.address}
    //       pair={v2Pair}
    //       mb={Boolean(stablePairs?.length) || index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
    //     />
    //   ))
    // }

    if (positionCards?.length > 0) {
      return positionCards
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <>
      {/* <Page>
        <AppBody> */}
      <Body>
        {renderBody()}
        {address && !v2IsLoading && (
          <Flex flexDirection="column" alignItems="center" mt="24px">
            <Text color="textSubtle" mb="8px">
              {t("Don't see a pool you joined?")}
            </Text>
            <Link href="/find" passHref>
              <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                {t('Find other LP tokens')}
              </Button>
            </Link>
          </Flex>
        )}
      </Body>
      <CardFooter style={{ textAlign: 'center' }}>
        <Link href="/add" passHref>
          <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="white" />}>
            {t('Add Liquidity')}
          </Button>
        </Link>
      </CardFooter>
      {/* </AppBody>
      </Page> */}
    </>
  )
}
