import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Text, RowBetween, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useExchangeRate } from 'views/LiquidStaking/hooks/useExchangeRate'
import { ExchangeRateTitle } from 'views/LiquidStaking/components/StakeInfo/ExchangeRateTitle'
import { LiquidStakingApr } from 'views/LiquidStaking/components/StakeInfo//LiquidStakingApr'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

interface StakeInfoProps {
  selectedList: LiquidStakingList
}

const StakeInfo: React.FC<StakeInfoProps> = ({ selectedList }) => {
  const { t } = useTranslation()
  const { exchangeRateList } = useExchangeRate({ decimals: selectedList?.token0?.decimals })

  const exchangeRateAmount = useMemo(() => {
    const pickedRate = exchangeRateList?.find(
      (i) => i?.contract?.toLowerCase() === selectedList?.contract?.toLowerCase(),
    )?.exchangeRate
    return new BigNumber(pickedRate) ?? BIG_ZERO
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
