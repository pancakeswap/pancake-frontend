import { Currency, Percent, Price } from '@pancakeswap/aptos-swap-sdk'
import { AutoColumn, AutoRow, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ONE_BIPS } from 'config/constants/exchange'
import formatAmountDisplay from 'utils/formatAmountDisplay'

export default function PoolPriceBar({
  currencyA,
  currencyB,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencyA: Currency
  currencyB: Currency
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price<Currency, Currency>
}) {
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      <AutoRow justifyContent="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text>{price ? formatAmountDisplay(price) : '-'}</Text>
          <Text fontSize="14px" pt={1}>
            {t('%assetA% per %assetB%', {
              assetA: currencyB?.symbol ?? '',
              assetB: currencyA?.symbol ?? '',
            })}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>{price?.invert() ? formatAmountDisplay(price?.invert()) : '-'}</Text>
          <Text fontSize="14px" pt={1}>
            {t('%assetA% per %assetB%', {
              assetA: currencyA?.symbol ?? '',
              assetB: currencyB?.symbol ?? '',
            })}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
          <Text fontSize="14px" pt={1}>
            {t('Share in Trading Pair')}
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
