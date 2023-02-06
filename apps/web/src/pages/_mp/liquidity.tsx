import { MpPageLayout } from 'components/MpPageLayout'
import { useRouter } from 'next/router'
import AddLiquidityPage from 'pages/add/[[...currency]]'
import RemoveLiquidityPage from 'pages/remove/[[...currency]]'
import Liquidity from 'views/Pool'
import PoolFinder from 'views/PoolFinder'

const MpLiquidityPage = () => {
  const { query } = useRouter()

  let Com = <Liquidity />

  if (query.page === 'add') {
    Com = <AddLiquidityPage />
  }
  if (query.page === 'remove') {
    Com = <RemoveLiquidityPage />
  }
  if (query.page === 'find') {
    Com = <PoolFinder />
  }

  return (
    <>
      {JSON.stringify(query, null, 2)}
      {Com}
    </>
  )
}

MpLiquidityPage.Layout = MpPageLayout
MpLiquidityPage.mp = true

export default MpLiquidityPage
