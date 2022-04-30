import useSWRImmutable from 'swr/immutable'
import ifoV3Abi from '../config/abi/ifoV3.json'
import ifoV2Abi from '../config/abi/ifoV2.json'
import { multicallv2 } from '../utils/multicall'
import { ifosConfig } from '../config/constants'
import { Ifo } from '../config/constants/types'

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

export const useActiveIfoWithBlocks = (): Ifo & { startBlock: number; endBlock: number } => {
  const { data: currentIfoBlocks = { startBlock: 0, endBlock: 0 } } = useSWRImmutable(
    activeIfo ? ['ifo', 'currentIfo'] : null,
    async () => {
      const abi = activeIfo.version === 3.1 ? ifoV3Abi : ifoV2Abi
      const [startBlock, endBlock] = await multicallv2(
        abi,
        [
          {
            address: activeIfo.address,
            name: 'startBlock',
          },
          {
            address: activeIfo.address,
            name: 'endBlock',
          },
        ],
        { requireSuccess: false },
      )

      return { startBlock: startBlock ? startBlock[0].toNumber() : 0, endBlock: endBlock ? endBlock[0].toNumber() : 0 }
    },
  )

  return activeIfo ? { ...activeIfo, ...currentIfoBlocks } : null
}
