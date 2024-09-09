import { CAKE, USDC } from '@pancakeswap/tokens'
import { useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import useStableConfig from 'views/Swap/hooks/useStableConfig'

const AddStableLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    chainId ? CAKE[chainId]?.address ?? USDC[chainId]?.address : '',
  ]

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  const stableConfig = useStableConfig({
    tokenA: currencyA,
    tokenB: currencyB,
  })

  return (
    stableConfig.stableSwapConfig && (
      <AddLiquidityV2FormProvider>
        <AddLiquidityV3Layout preferredSelectType={SELECTOR_TYPE.STABLE}>
          <UniversalAddLiquidity
            preferredSelectType={SELECTOR_TYPE.STABLE}
            currencyIdA={currencyIdA}
            currencyIdB={currencyIdB}
          />
        </AddLiquidityV3Layout>
      </AddLiquidityV2FormProvider>
    )
  )
}

AddStableLiquidityPage.chains = CHAIN_IDS

export default AddStableLiquidityPage

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { currency: [] } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const currency = params?.currency || []
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
        statusCode: 307,
        destination: `/add/${currencyIdA}`,
      },
    }
  }

  return {
    props: {},
  }
}
