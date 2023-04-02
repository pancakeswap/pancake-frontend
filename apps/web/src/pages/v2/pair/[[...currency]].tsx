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

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
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
    currency0: baseCurrency,
    currency1: currencyB,
    token0Deposited,
    token1Deposited,
  })

  const { isMobile } = useMatchBreakpoints()

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={
            <Flex justifyContent="center" alignItems="center">
              <DoubleCurrencyLogo size={24} currency0={baseCurrency} currency1={currencyB} />
              <Heading as="h2" ml="8px">
                {baseCurrency?.symbol}-{currencyB?.symbol} LP
              </Heading>
            </Flex>
          }
          backTo="/liquidity"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/v2/add/${currencyIdA}/${currencyIdB}`}>
                  <Button width="100%">{t('Add')}</Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to={`/v2/remove/${currencyIdA}/${currencyIdB}`}>
                  <Button ml="16px" variant="secondary" width="100%">
                    {t('Remove')}
                  </Button>
                </NextLinkFromReactRouter>
              </>
            )
          }
        />
        <CardBody>
          {isMobile && (
            <>
              <NextLinkFromReactRouter to={`/v2/add/${currencyIdA}/${currencyIdB}`}>
                <Button width="100%" mb="8px">
                  {t('Add')}
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/v2/remove/${currencyIdA}/${currencyIdB}`}>
                <Button variant="secondary" width="100%" mb="8px">
                  {t('Remove')}
                </Button>
              </NextLinkFromReactRouter>
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
                      <CurrencyLogo currency={baseCurrency} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {baseCurrency?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{token0Deposited?.toSignificant(4)}</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={currencyB} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {currencyB?.symbol}
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
          <Text>
            {t('Your share in pool')}: {poolTokenPercentage ? `${poolTokenPercentage.toFixed(8)}%` : '-'}
          </Text>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolV2Page.chains = CHAIN_IDS
