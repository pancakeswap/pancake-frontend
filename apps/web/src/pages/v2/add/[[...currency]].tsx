import { CAKE, USDC } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { resetMintState } from 'state/mint/actions'
import { CHAIN_IDS } from 'utils/wagmi'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import { useActiveChainId } from 'hooks/useActiveChainId'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useAtom } from 'jotai'
import { mintReducerAtom } from 'state/mint/reducer'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const [, dispatch] = useAtom(mintReducerAtom)

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  return (
    <LiquidityFormProvider>
      <AddLiquidityV3Layout>
        <UniversalAddLiquidity isV2 currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
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
