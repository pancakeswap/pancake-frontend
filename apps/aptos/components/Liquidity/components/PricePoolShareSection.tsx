import { RowBetween, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'

export default function PricePoolShareSection({ farmPriceBar, noLiquidity }) {
  const { t } = useTranslation()

  return (
    <LightCard padding="0px" borderRadius="20px">
      <RowBetween padding="1px">
        <Text fontSize="14px">{noLiquidity ? t('Initial prices and share in the pair') : t('Prices and Share')}</Text>
      </RowBetween>{' '}
      <LightCard padding="1rem" borderRadius="20px">
        {farmPriceBar}
      </LightCard>
    </LightCard>
  )
}
