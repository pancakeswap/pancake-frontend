import { CAKE, USDC } from '@pancakeswap/tokens'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidity from 'views/AddLiquidity'
import AddStableLiquidity from 'views/AddLiquidity/AddStableLiquidity/index'
import useStableConfig, { StableConfigContext } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useActiveChainId } from 'hooks/useActiveChainId'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const stableConfig = useStableConfig({
    tokenA: currencyA,
    tokenB: currencyB,
  })

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  return stableConfig.stableSwapConfig ? (
    <StableConfigContext.Provider value={stableConfig}>
      <AddStableLiquidity currencyA={currencyA} currencyB={currencyB} />
    </StableConfigContext.Provider>
  ) : (
    <AddLiquidity currencyA={currencyA} currencyB={currencyB} />
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { currency: [] } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { currency = [] } = params
  const [currencyIdA, currencyIdB] = currency
  const match = currencyIdA?.match(OLD_PATH_STRUCTURE)

  if (match?.length) {
    return {
      redirect: {
        statusCode: 301,
        destination: `/add/${match[1]}/${match[2]}`,
      },
    }
  }

  if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/add/${currencyIdA}`,
      },
    }
  }

  return {
    props: {},
  }
}
