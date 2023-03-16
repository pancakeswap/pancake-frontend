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
import { isStableFarm } from '@pancakeswap/farms'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

export const config = {
  runtime: 'edge',
}

const AddLiquidityPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  currencyIdA: currencyIdA_,
  currencyIdB: currencyIdB_,
}) => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  // fetching farm api instead of using redux store here to avoid huge amount of actions and hooks needed
  const { data: farmsV2Public } = useFarmV2PublicAPI()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    currencyIdA_ || native.symbol,
    currencyIdB_ || CAKE[chainId]?.address || USDC[chainId]?.address,
  ]

  const tokenA = useCurrency(currencyIdA)
  const tokenB = useCurrency(currencyIdB)

  const isMounted = useIsMounted()

  // Initial prefer farm type v2/stable if there is a farm for the pair
  const preferFarmType = useMemo(() => {
    const preferFarm =
      isMounted &&
      farmsV2Public?.length &&
      tokenA &&
      tokenB &&
      router.isReady &&
      farmsV2Public.find(
        (farm) =>
          farm.multiplier !== '0X' &&
          ((farm.token.address === tokenA.wrapped.address && farm.quoteToken.address === tokenB.wrapped.address) ||
            (farm.token.address === tokenB.wrapped.address && farm.quoteToken.address === tokenA.wrapped.address)),
      )

    return preferFarm ? (isStableFarm(preferFarm) ? SELECTOR_TYPE.STABLE : SELECTOR_TYPE.V2) : undefined
  }, [farmsV2Public, isMounted, router.isReady, tokenA, tokenB])

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
          preferredSelectType={preferFarmType}
          isV2={preferFarmType === SELECTOR_TYPE.V2}
        />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

// @ts-ignore
AddLiquidityPage.chains = CHAIN_IDS

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps = (async ({ params }) => {
  return {
    props: {
      currencyIdA: params?.currency?.[0] ?? '',
      currencyIdB: params?.currency?.[1] ?? '',
    },
  }
}) satisfies GetStaticProps

export default AddLiquidityPage
