import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { Button, Card, Dots, Flex, Tag, Text } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { DoubleCurrencyLogo } from 'components/Logo'
import { Bound } from 'config/constants/types'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import Image from 'next/image'
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem'
import RangeTag from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeTag'
import { useAccount } from 'wagmi'

export function Step4() {
  const { address: account } = useAccount()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { positions, loading: v3Loading } = useV3Positions(account)

  return (
    <AppBody style={{ maxWidth: '700px' }} m="auto">
      <AppHeader title="Your Liquidity" subtitle="List of your liquidity positions" />
      <AtomBox bg="gradientCardHeader" style={{ minHeight: '400px' }} pt="16px" px="24px">
        {!account ? (
          <Text color="textSubtle" pt="24px" textAlign="center" bold fontSize="16px">
            {t('Connect to a wallet to view your liquidity.')}
          </Text>
        ) : v3Loading ? (
          <Text color="textSubtle" pt="24px" textAlign="center" bold fontSize="16px">
            <Dots>{t('Loading')}</Dots>
          </Text>
        ) : !positions?.length ? (
          <AtomBox textAlign="center" pt="24px">
            <Text color="textSubtle" textAlign="center" bold fontSize="16px">
              {t('No liquidity found.')}
            </Text>
            <Image src="/images/decorations/liquidity.png" width={174} height={184} alt="liquidity-image" />
          </AtomBox>
        ) : (
          positions.map((p) => (
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
              }) => (
                <Card mb="8px" mx="24px">
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

                    <RangeTag removed={removed} outOfRange={outOfRange} />
                  </Flex>
                </Card>
              )}
            </PositionListItem>
          ))
        )}
      </AtomBox>
      <AtomBox p="24px">
        <Button width="100%">{t('Add Liquidity')}</Button>
      </AtomBox>
    </AppBody>
  )
}
