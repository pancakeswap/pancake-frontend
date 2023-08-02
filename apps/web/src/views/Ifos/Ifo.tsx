import { useQuery } from '@tanstack/react-query'
import { getActiveIfo } from '@pancakeswap/ifos'

import { useActiveChainId } from 'hooks/useActiveChainId'

import CurrentIfo from './CurrentIfo'
import SoonIfo from './SoonIfo'

const Ifo = () => {
  const { chainId } = useActiveChainId()
  const { data } = useQuery([chainId, 'activeIfo'], () => getActiveIfo(chainId))
  const activeIfo = data?.ifo
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : <SoonIfo />
}

export default Ifo
