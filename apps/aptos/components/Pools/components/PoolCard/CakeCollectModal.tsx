import { Pool } from '@pancakeswap/uikit'
import useHarvestFarm from 'components/Farms/hooks/useHarvestFarm'
import { CAKE_PID } from 'components/Pools/constants'
import CollectModalContainer from './CollectModalContainer'

const CakeCollectModal = ({
  earningTokenAddress,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    earningTokenAddress: string
    stakingTokenAddress: string
  }
>) => {
  const { onReward } = useHarvestFarm(CAKE_PID, earningTokenAddress)

  return <CollectModalContainer onReward={onReward} {...rest} />
}

export default CakeCollectModal
