import {
  AutoRow,
  Button,
  Card,
  CardBody,
  Flex,
  NextLinkFromReactRouter,
  Text,
  Box,
  Heading,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'

import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import styled from 'styled-components'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'

import { LightGreyCard } from 'components/Card'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useCurrency } from 'hooks/Tokens'
import { useV2Pair } from 'hooks/usePairs'
import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { usePoolTokenPercentage, useTokensDeposited, useTotalUSDValue } from 'components/PositionCard'
import currencyId from 'utils/currencyId'
import { Native, WNATIVE } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
  const router = useRouter()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

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

  let addCurrencyA = currencyId(baseCurrency)
  let addCurrencyB = currencyId(currencyB)

  if (WNATIVE[chainId]?.address === baseCurrency?.wrapped?.address) {
    addCurrencyA = currencyId(Native.onChain(chainId))
  } else if (WNATIVE[chainId]?.address === currencyB?.wrapped?.address) {
    addCurrencyB = currencyId(Native.onChain(chainId))
  }

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={
            <Flex justifyContent="center" alignItems="center">
              <DoubleCurrencyLogo size={24} currency0={baseCurrency} currency1={currencyB} />
              <Heading as="h2" ml="8px">
                {baseCurrency?.wrapped?.symbol}-{currencyB?.wrapped?.symbol} LP
              </Heading>
            </Flex>
          }
          backTo="/liquidity"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/v2/add/${addCurrencyA}/${addCurrencyB}`}>
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
            )
          }
        />
        <CardBody>
          {isMobile && (
            <>
              <NextLinkFromReactRouter to={`/v2/add/${addCurrencyA}/${addCurrencyB}`}>
                <Button width="100%" mb="8px">
                  Add
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter
                to={`/v2/remove/${baseCurrency?.wrapped?.address}/${currencyB?.wrapped?.address}`}
              >
                <Button variant="secondary" width="100%" mb="8px">
                  Remove
                </Button>
              </NextLinkFromReactRouter>
            </>
          )}
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
                        {baseCurrency?.wrapped?.symbol}
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
                        {currencyB?.wrapped?.symbol}
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
