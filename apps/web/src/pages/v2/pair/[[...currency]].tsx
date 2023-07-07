import {
  AutoRow,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  NextLinkFromReactRouter,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'

import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import styled from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'

import { LightGreyCard } from 'components/Card'
import { usePoolTokenPercentage, useTokensDeposited, useTotalUSDValue } from 'components/PositionCard'
import { useCurrency } from 'hooks/Tokens'
import { useV2Pair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { useRouter } from 'next/router'
import { useTokenBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useLPApr } from 'state/swap/useLPApr'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMasterchef } from 'hooks/useContract'
import useSWRImmutable from 'swr/immutable'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  const router = useRouter()
  const { address: account } = useAccount()

  const [currencyIdA, currencyIdB] = router?.query?.currency ? router.query.currency : []

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const [, pair] = useV2Pair(baseCurrency, currencyB)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  const totalUSDValue = useTotalUSDValue({
    currency0: pair?.token0,
    currency1: pair?.token1,
    token0Deposited,
    token1Deposited,
  })

  const masterchefV2Contract = useMasterchef()

  const { data: isFarmExistActiveForPair } = useSWRImmutable(
    chainId && pair && masterchefV2Contract && ['isFarmExistActiveForPair', chainId, pair.liquidityToken.address],
    async () => {
      const farmsConfig = (await getFarmConfig(chainId)) || []
      const farmPair = farmsConfig.find(
        (farm) => farm.lpAddress.toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      if (farmPair) {
        const poolInfo = await masterchefV2Contract.read.poolInfo([BigInt(farmPair.pid)])
        const allocPoint = poolInfo[2] as bigint
        return allocPoint > 0 ? 'exist' : 'notexist'
      }
      return 'exist'
    },
  )

  const { isMobile } = useMatchBreakpoints()

  const poolData = useLPApr(pair)

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={
            <Flex justifyContent="center" alignItems="center">
              <DoubleCurrencyLogo size={24} currency0={pair?.token0} currency1={pair?.token1} />
              <Heading as="h2" ml="8px">
                {pair?.token0?.symbol}-{pair?.token1?.symbol} LP
              </Heading>
            </Flex>
          }
          backTo="/liquidity"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/v2/add/${pair?.token0.address}/${pair?.token1.address}`}>
                  <Button width="100%" disabled={!pair}>
                    {t('Add')}
                  </Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/v2/remove/${pair?.token0.address}/${pair?.token1.address}`}
                  style={{ margin: '0px 8px' }}
                >
                  <Button variant="secondary" width="100%" disabled={!pair}>
                    {t('Remove')}
                  </Button>
                </NextLinkFromReactRouter>
                {isFarmExistActiveForPair === 'notexist' && (
                  <NextLinkFromReactRouter to={`/v2/migrate/${pair?.liquidityToken?.address}`}>
                    <Button variant="secondary" width="100%" disabled={!pair}>
                      {t('Migrate')}
                    </Button>
                  </NextLinkFromReactRouter>
                )}
              </>
            )
          }
        />
        <CardBody>
          {isMobile && (
            <>
              <NextLinkFromReactRouter to={`/v2/add/${pair?.token0.address}/${pair?.token1.address}`}>
                <Button width="100%" mb="8px" disabled={!pair}>
                  {t('Add')}
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/v2/remove/${pair?.token0.address}/${pair?.token1.address}`}>
                <Button variant="secondary" width="100%" mb="8px" disabled={!pair}>
                  {t('Remove')}
                </Button>
              </NextLinkFromReactRouter>
              {isFarmExistActiveForPair === 'notexist' && (
                <NextLinkFromReactRouter to={`/v2/migrate/${pair.liquidityToken.address}`}>
                  <Button variant="secondary" width="100%" mb="8px" disabled={!pair}>
                    {t('Migrate')}
                  </Button>
                </NextLinkFromReactRouter>
              )}
            </>
          )}
          <AutoRow>
            <Flex alignItems="center" justifyContent="space-between" width="100%" mb="8px">
              <Box width="100%" mr="4px">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Liquidity')}
                </Text>
                <Text fontSize="24px" fontWeight={600}>
                  $
                  {totalUSDValue
                    ? totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                </Text>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={pair?.token0} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {pair?.token0?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{token0Deposited?.toSignificant(4)}</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={pair?.token1} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {pair?.token1?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{token1Deposited?.toSignificant(4)}</Text>
                    </Flex>
                  </AutoRow>
                </LightGreyCard>
              </Box>
            </Flex>
          </AutoRow>
          {poolData && (
            <Text>
              {t('LP reward APR')}: {formatAmount(poolData.lpApr7d)}%
            </Text>
          )}
          <Text>
            {t('Your share in pool')}: {poolTokenPercentage ? `${poolTokenPercentage.toFixed(8)}%` : '-'}
          </Text>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolV2Page.chains = CHAIN_IDS
