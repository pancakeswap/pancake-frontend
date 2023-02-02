import { AddIcon, Button, CardBody, CardFooter, Text, Dots, Card, Flex, Tag } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import styled from 'styled-components'
import { useWeb3React } from '@pancakeswap/wagmi'
import { AppBody, AppHeader } from 'components/App'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { CHAIN_IDS } from 'utils/wagmi'
import PositionListItem from 'views/AddLiquidityV3/components/PoolListItem'
import Page from 'views/Page'
import { useTranslation } from '@pancakeswap/localization'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Bound } from 'views/AddLiquidityV3/form/actions'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { Percent } from '@pancakeswap/sdk'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export default function PoolListPage() {
  const { account } = useWeb3React()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  let bodyChildren = null

  if (positionsLoading) {
    bodyChildren = (
      <Text color="textSubtle" textAlign="center">
        <Dots>{t('Loading')}</Dots>
      </Text>
    )
  } else if (positions?.length) {
    bodyChildren = positions.map((p) => {
      return (
        <PositionListItem key={p.tokenId.toString()} positionDetails={p}>
          {({
            currencyBase,
            currencyQuote,
            removed,
            outOfRange,
            priceLower,
            tickAtLimit,
            priceUpper,
            feeAmount,
            positionSummaryLink,
          }) => (
            <Card mb="8px">
              <NextLink href={positionSummaryLink}>
                <Flex justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Flex alignItems="center" mb="4px">
                      <DoubleCurrencyLogo currency0={currencyQuote} currency1={currencyBase} size={20} />
                      <Text bold ml="8px">
                        {!currencyQuote || !currencyBase ? (
                          <Dots>{t('Loading')}</Dots>
                        ) : (
                          `${currencyQuote.symbol}/${currencyBase.symbol}`
                        )}
                      </Text>
                      <Tag ml="8px" variant="secondary" outline>
                        {new Percent(feeAmount, 1_000_000).toSignificant()}%
                      </Tag>
                    </Flex>
                    <Text fontSize="14px" color="textSubtle">
                      Min {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)} / Max:{' '}
                      {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)} {currencyQuote?.symbol} per{' '}
                      {currencyBase?.symbol}
                    </Text>
                  </Flex>

                  {removed ? (
                    <Tag ml="8px" variant="failure" outline>
                      Closed
                    </Tag>
                  ) : outOfRange ? (
                    <Tag ml="8px" variant="textSubtle" outline>
                      Out of range
                    </Tag>
                  ) : (
                    <Tag ml="8px" variant="success" outline>
                      In range
                    </Tag>
                  )}
                </Flex>
              </NextLink>
            </Card>
          )}
        </PositionListItem>
      )
    })
  } else {
    bodyChildren = (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title="Your Liquidity" subtitle="List of your liquidity positions" />
        <Body>{bodyChildren}</Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <NextLink href="/add" passHref>
            <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="invertedContrast" />}>
              {t('Add Liquidity')}
            </Button>
          </NextLink>
        </CardFooter>
      </AppBody>
    </Page>
  )
}

PoolListPage.chains = CHAIN_IDS
