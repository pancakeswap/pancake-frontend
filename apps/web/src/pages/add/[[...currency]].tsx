import { CAKE, USDC } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useFarmV2PublicAPI } from 'state/farms/hooks'
import { resetMintState } from 'state/mint/actions'
import { useCurrency } from 'hooks/Tokens'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV3, { AddLiquidityV3Layout } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useIsMounted } from '@pancakeswap/hooks'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  // fetching farm api instead of using redux store here to avoid huge amount of actions and hooks needed
  const { data: farmsV2Public } = useFarmV2PublicAPI()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const tokenA = useCurrency(currencyIdA)
  const tokenB = useCurrency(currencyIdB)

  const isMounted = useIsMounted()

  // Initial prefer v2 if there is a farm for the pair
  const preferV2 = useMemo(
    () =>
      isMounted &&
      farmsV2Public?.length &&
      tokenA &&
      tokenB &&
      router.isReady &&
      farmsV2Public.some(
        (farm) =>
          farm.multiplier !== '0X' &&
          ((farm.token.address === tokenA.wrapped.address && farm.quoteToken.address === tokenB.wrapped.address) ||
            (farm.token.address === tokenB.wrapped.address && farm.quoteToken.address === tokenA.wrapped.address)),
      ),
    [farmsV2Public, isMounted, router.isReady, tokenA, tokenB],
  )

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  return (
    <LiquidityFormProvider>
      <AddLiquidityV3Layout>
        <AddLiquidityV3
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
          preferredSelectType={preferV2 ? SELECTOR_TYPE.V2 : undefined}
          isV2={preferV2}
        />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
