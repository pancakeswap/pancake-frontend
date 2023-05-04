import { Text, RowBetween } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import useSWR from 'swr'

export function LiquidStakingApr() {
  const { t } = useTranslation()

  const {
    currentLanguage: { locale },
  } = useTranslation()

  const { data: apr } = useSWR<number>('liquid-staking-apr', async () => {
    const { data: responseData } = await fetch(
      'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    ).then((res) => res.json())

    if (responseData?.annualInterestRate) {
      return responseData.annualInterestRate * 100
    }

    return null
  })

  return (
    <RowBetween mb="24px">
      <Text color="textSubtle">{t('APR')}</Text>
      <Text>{apr ? `${formatLocaleNumber({ number: apr, locale })}%` : '-'}</Text>
    </RowBetween>
  )
}
