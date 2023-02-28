import { CAKE, USDC } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV3, { AddLiquidityV3Layout } from 'views/AddLiquidityV3'
import { useActiveChainId } from 'hooks/useActiveChainId'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

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
        <AddLiquidityV3 currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
