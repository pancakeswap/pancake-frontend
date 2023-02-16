import { AutoRow, Button, Card, CardBody, Flex, NextLinkFromReactRouter, Text, Box } from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'

// import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import styled from 'styled-components'
// import { useStableFarms } from 'views/Swap/StableSwap/hooks/useStableConfig'

// import { CurrencyAmount } from '@pancakeswap/sdk'
import { LightGreyCard } from 'components/Card'
// import { CurrencyLogo } from 'components/Logo'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
  // const router = useRouter()

  // const { address: poolAddress } = router.query

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title="USDT-BUSD LP"
          backTo="/pool-v3"
          noConfig
          buttons={
            <>
              <NextLinkFromReactRouter to="/increase">
                <Button width="100%">Add</Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to="/remove">
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
                <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                  Liquidity
                </Text>
                <Text fontSize="24px" fontWeight={500}>
                  $123
                </Text>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      {/* <CurrencyLogo currency={stableLp?.token0} /> */}
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        USDT
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text bold mr="4px">
                        123
                      </Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      {/* <CurrencyLogo currency={stableLp?.token1} /> */}
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        BUSD
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text bold mr="4px">
                        123
                      </Text>
                    </Flex>
                  </AutoRow>
                </LightGreyCard>
              </Box>
            </Flex>
          </AutoRow>
          <Text>Your share in pool: 0.00013%</Text>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolV2Page.chains = CHAIN_IDS
