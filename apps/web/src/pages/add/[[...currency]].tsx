import { isStableFarm } from '@pancakeswap/farms'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useFarmV2PublicAPI } from 'state/farms/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'

const AddLiquidityPage = () => {
  const router = useRouter()

  // fetching farm api instead of using redux store here to avoid huge amount of actions and hooks needed
  const { data: farmsV2Public } = useFarmV2PublicAPI()
  const { data: farmV3Public } = useFarmsV3Public()

  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // Initial prefer farm type if there is a farm for the pair
  const preferFarmType = useMemo(() => {
    if (!currencyA || !currencyB || !router.isReady) return undefined

    const hasV3Farm = farmV3Public?.farmsWithPrice.find(
      (farm) =>
        farm.multiplier !== '0X' &&
        ((farm.token.equals(currencyA.wrapped) && farm.quoteToken.equals(currencyB.wrapped)) ||
          (farm.quoteToken.equals(currencyA.wrapped) && farm.token.equals(currencyB.wrapped))),
    )
    if (hasV3Farm)
      return {
        type: SELECTOR_TYPE.V3,
        feeAmount: hasV3Farm.feeAmount,
      }

    const hasV2Farm = farmsV2Public?.find(
      (farm) =>
        farm.multiplier !== '0X' &&
        ((farm.token.address === currencyA.wrapped.address && farm.quoteToken.address === currencyB.wrapped.address) ||
          (farm.token.address === currencyB.wrapped.address && farm.quoteToken.address === currencyA.wrapped.address)),
    )
    return hasV2Farm
      ? isStableFarm(hasV2Farm)
        ? { type: SELECTOR_TYPE.STABLE }
        : { type: SELECTOR_TYPE.V2 }
      : undefined
  }, [farmsV2Public, farmV3Public?.farmsWithPrice, currencyA, currencyB, router])

  const handleRefresh = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          currency: [currencyIdA!, currencyIdB!],
        },
      },
      undefined,
      { shallow: true },
    )
  }, [router, currencyIdA, currencyIdB])

  return (
    <AddLiquidityV2FormProvider>
      <LiquidityFormProvider>
        <AddLiquidityV3Layout
          handleRefresh={handleRefresh}
          showRefreshButton={preferFarmType?.type === SELECTOR_TYPE.V3 && preferFarmType?.feeAmount !== feeAmount}
        >
          <UniversalAddLiquidity
            currencyIdA={currencyIdA}
            currencyIdB={currencyIdB}
            preferredSelectType={!feeAmount ? preferFarmType?.type : undefined}
            preferredFeeAmount={!feeAmount ? preferFarmType?.feeAmount : undefined}
          />
          <V3SubgraphHealthIndicator />
        </AddLiquidityV3Layout>
      </LiquidityFormProvider>
    </AddLiquidityV2FormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS
AddLiquidityPage.screen = true

export default AddLiquidityPage
