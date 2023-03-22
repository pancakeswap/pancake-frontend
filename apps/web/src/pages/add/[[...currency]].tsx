import { isStableFarm } from '@pancakeswap/farms'
import { useIsMounted } from '@pancakeswap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useFarmV2PublicAPI } from 'state/farms/hooks'
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

  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const isMounted = useIsMounted()

  // Initial prefer farm type v2/stable if there is a farm for the pair
  const preferFarmType = useMemo(() => {
    const preferFarm =
      !feeAmount &&
      isMounted &&
      farmsV2Public?.length &&
      currencyA &&
      currencyB &&
      router.isReady &&
      farmsV2Public.find(
        (farm) =>
          farm.multiplier !== '0X' &&
          ((farm.token.address === currencyA.wrapped.address &&
            farm.quoteToken.address === currencyB.wrapped.address) ||
            (farm.token.address === currencyB.wrapped.address &&
              farm.quoteToken.address === currencyA.wrapped.address)),
      )

    return preferFarm ? (isStableFarm(preferFarm) ? SELECTOR_TYPE.STABLE : SELECTOR_TYPE.V2) : undefined
  }, [farmsV2Public, feeAmount, isMounted, router.isReady, currencyA, currencyB])

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
          preferredSelectType={preferFarmType}
          isV2={preferFarmType === SELECTOR_TYPE.V2}
        />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
