import Pools from 'views/Pools'
import PoolsMpPageLayout from 'views/Pools/MpPageLayout'

const MpPoolsPage = () => {
  return <Pools />
}
MpPoolsPage.mp = true
MpPoolsPage.Layout = PoolsMpPageLayout

export default MpPoolsPage
