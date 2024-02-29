import { useTranslation } from '@pancakeswap/localization'
import { RowBetween, Skeleton, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { LiquidStakingApr } from 'views/LiquidStaking/components/StakeInfo//LiquidStakingApr'
import { ExchangeRateTitle } from 'views/LiquidStaking/components/StakeInfo/ExchangeRateTitle'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useExchangeRate } from 'views/LiquidStaking/hooks/useExchangeRate'

interface StakeInfoProps {
  selectedList: LiquidStakingList | null
}

const StakeInfo: React.FC<StakeInfoProps> = ({ selectedList }) => {
  const { t } = useTranslation()
  const { exchangeRateList } = useExchangeRate({ decimals: selectedList?.token0?.decimals })

  const exchangeRateAmount = useMemo(() => {
    const pickedRate = exchangeRateList?.find(
      (i) => i?.contract?.toLowerCase() === selectedList?.contract?.toLowerCase(),
    )?.exchangeRate

    const amount = pickedRate ? new BigNumber('1').dividedBy(pickedRate.toString()) : BIG_ZERO
    return amount
  }, [exchangeRateList, selectedList?.contract])

  return (
    <>
      <RowBetween mb="8px">
        <ExchangeRateTitle tokenOSymbol={selectedList?.token0?.symbol} token1Symbol={selectedList?.token1?.symbol} />
        {exchangeRateAmount.isNaN() ? (
          <Skeleton width={50} height={10} />
        ) : (
          <>
            {exchangeRateAmount ? (
              <Text>
                {t('1 %token0% = %exchangeRateAmount% %token1%', {
                  token0: selectedList?.token0?.symbol,
                  token1: selectedList?.token1?.symbol,
                  exchangeRateAmount: getFullDisplayBalance(exchangeRateAmount, 0, 6),
                })}
              </Text>
            ) : (
              '-'
            )}
          </>
        )}
      </RowBetween>
      <LiquidStakingApr contract={selectedList?.contract} tokenOSymbol={selectedList?.token0?.symbol} />
    </>
  )
}

export default StakeInfo
