import { isStableFarm } from '@pancakeswap/farms'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useFarmV2PublicAPI } from 'state/farms/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { resetMintState } from 'state/mint/actions'
import { CHAIN_IDS } from 'utils/wagmi'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'

const AddLiquidityPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // fetching farm api instead of using redux store here to avoid huge amount of actions and hooks needed
  const { data: farmsV2Public } = useFarmV2PublicAPI()
  const { data: farmV3Public } = useFarmsV3Public()

  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // Initial prefer farm type if there is a farm for the pair
  const preferFarmType = useMemo(() => {
    if (feeAmount || !currencyA || !currencyB || !router.isReady) return undefined

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
  }, [feeAmount, farmsV2Public, farmV3Public?.farmsWithPrice, currencyA, currencyB, router.isReady])

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  return (
    <LiquidityFormProvider>
      <AddLiquidityV3Layout>
        <UniversalAddLiquidity
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
          preferredSelectType={preferFarmType?.type}
          isV2={preferFarmType?.type === SELECTOR_TYPE.V2}
          preferredFeeAmount={preferFarmType?.feeAmount}
        />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
