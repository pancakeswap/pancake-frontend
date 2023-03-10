import { CAKE, USDC } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useFarmV2Config } from 'state/farms/hooks'
import { resetMintState } from 'state/mint/actions'
import { useCurrency } from 'hooks/Tokens'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV3, { AddLiquidityV3Layout } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useIsMounted } from '@pancakeswap/hooks'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  const { data: farmsV2Configs } = useFarmV2Config()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const tokenA = useCurrency(currencyIdA)
  const tokenB = useCurrency(currencyIdB)

  const isMounted = useIsMounted()

  // Redirect to v2 if there is a farm for the pair
  useEffect(() => {
    if (isMounted && farmsV2Configs?.length && tokenA && tokenB) {
      if (
        farmsV2Configs.some(
          (farm) =>
            (farm.token.address === tokenA.wrapped.address && farm.quoteToken.address === tokenB.wrapped.address) ||
            (farm.token.address === tokenB.wrapped.address && farm.quoteToken.address === tokenA.wrapped.address),
        )
      ) {
        router.push(`/v2/add/${currencyIdA}/${currencyIdB}`)
      }
    }
  }, [currencyIdA, currencyIdB, farmsV2Configs, isMounted, router, tokenA, tokenB])

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  return (
    <LiquidityFormProvider>
      <AddLiquidityV3Layout>
        <AddLiquidityV3 currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
