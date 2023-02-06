import { MpPageLayout } from 'components/MpPageLayout'
import { useRouter } from 'next/router'
import AddLiquidityPage from 'pages/add/[[...currency]]'
import RemoveLiquidityPage from 'pages/remove/[[...currency]]'
import Liquidity from 'views/Pool'
import PoolFinder from 'views/PoolFinder'

const MpLiquidityPage = () => {
  const { query } = useRouter()

  if (query.page === 'add') {
    return <AddLiquidityPage />
  }
  if (query.page === 'remove') {
    return <RemoveLiquidityPage />
  }
  if (query.page === 'find') {
    return <PoolFinder />
  }

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
