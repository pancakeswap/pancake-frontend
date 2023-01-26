import { useWeb3React } from '@pancakeswap/wagmi'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { CHAIN_IDS } from 'utils/wagmi'
import PositionListItem from 'views/AddLiquidityV3/components/PoolListItem'

export default function PoolListPage() {
  const { account } = useWeb3React()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  if (positionsLoading) {
    return <div>Loading</div>
  }

  return (
    <ul>
      {positions?.length
        ? positions.map((p) => {
            return (
              <li>
                <PositionListItem key={p.tokenId.toString()} positionDetails={p} />
              </li>
            )
          })
        : 'No position'}
    </ul>
  )
}

PoolListPage.chains = CHAIN_IDS
