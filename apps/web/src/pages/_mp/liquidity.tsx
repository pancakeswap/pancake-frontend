import { MpPageLayout } from 'components/MpPageLayout'
import { useRouter } from 'next/router'
import Liquidity from 'views/Pool'

const MpLiquidityPage = () => {
  const { query } = useRouter()
  return (
    <>
      {JSON.stringify(query, null, 2)}
      <Liquidity />
    </>
  )
}

MpLiquidityPage.Layout = MpPageLayout
MpLiquidityPage.mp = true

export default MpLiquidityPage
