import { useRouter } from 'next/router'
import { InfoPageLayout } from 'views/Info'
import Pool from 'views/Info/Pools/PoolPage'
import { CHAIN_IDS } from '@pancakeswap/wagmi'

const PoolPage = () => {
  const router = useRouter()
  return <Pool address={String(router.query.address)} />
}

PoolPage.Layout = InfoPageLayout
PoolPage.chains = CHAIN_IDS
export default PoolPage
