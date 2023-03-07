import { AutoRow, Button, Card, CardBody, Flex, NextLinkFromReactRouter, Text, Box, Heading } from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'

import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import styled from 'styled-components'
// import { useStableFarms } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'

// import { CurrencyAmount } from '@pancakeswap/sdk'
import { LightGreyCard } from 'components/Card'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useCurrency } from 'hooks/Tokens'
import { useV2Pair } from 'hooks/usePairs'
import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { usePoolTokenPercentage, useTokensDeposited, useTotalUSDValue } from 'components/PositionCard'
// import { CurrencyLogo } from 'components/Logo'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
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
            <>
              <NextLinkFromReactRouter to={`/v2/add/${baseCurrency?.wrapped?.address}/${currencyB?.wrapped?.address}`}>
                <Button width="100%">Add</Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter
                to={`/v2/remove/${baseCurrency?.wrapped?.address}/${currencyB?.wrapped?.address}`}
              >
                <Button ml="16px" variant="secondary" width="100%">
                  Remove
                </Button>
              </NextLinkFromReactRouter>
            </>
          }
        />
        <CardBody>
          <AutoRow>
            <Flex alignItems="center" justifyContent="space-between" width="100%" mb="8px">
              <Box width="100%" mr="4px">
                <Text fontSize="16px" color="secondary" bold textTransform="uppercase">
                  Liquidity
                </Text>
                <Text fontSize="24px" fontWeight={500}>
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
          <Text>Your share in pool: {poolTokenPercentage ? `${poolTokenPercentage.toFixed(8)}%` : '-'}</Text>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolV2Page.chains = CHAIN_IDS
