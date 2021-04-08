import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useBlock } from 'state/hooks'
import { useIfoV2Contract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import makeBatchRequest from 'utils/makeBatchRequest'
import { PublicIfoData, PoolCharacteristics } from './types'

const getStatus = (currentBlock: number, startBlock: number, endBlock: number): IfoStatus => {
  // Add an extra check to currentBlock because it takes awhile to fetch so the initial value is 0
  // making the UI change to an inaccurate status
  if (currentBlock === 0) {
    return 'idle'
  }

  if (currentBlock < startBlock) {
    return 'coming_soon'
  }

  if (currentBlock >= startBlock && currentBlock <= endBlock) {
    return 'live'
  }

  if (currentBlock > endBlock) {
    return 'finished'
  }

  return 'idle'
}

const formatPool = (pool) => ({
  raisingAmountPool: new BigNumber(pool[0]),
  offeringAmountPool: new BigNumber(pool[1]),
  limitPerUserInLP: new BigNumber(pool[2]),
  hasTax: pool[3],
  totalAmountPool: new BigNumber(pool[4]),
  sumTaxesOverflow: new BigNumber(pool[5]),
})

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address, releaseBlockNumber } = ifo
  const [state, setState] = useState<PublicIfoData>({
    status: 'idle',
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: new BigNumber(0),
      offeringAmountPool: new BigNumber(0),
      limitPerUserInLP: new BigNumber(0),
      hasTax: false,
      totalAmountPool: new BigNumber(0),
      sumTaxesOverflow: new BigNumber(0),
    },
    poolUnlimited: {
      raisingAmountPool: new BigNumber(0),
      offeringAmountPool: new BigNumber(0),
      limitPerUserInLP: new BigNumber(0),
      hasTax: true,
      totalAmountPool: new BigNumber(0),
      sumTaxesOverflow: new BigNumber(0),
    },
    startBlockNum: 0,
    endBlockNum: 0,
  })
  const { currentBlock } = useBlock()
  const contract = useIfoV2Contract(address)

  useEffect(() => {
    const fetchProgress = async () => {
      const [startBlock, endBlock, poolBasic, poolUnlimited] = (await makeBatchRequest([
        contract.methods.startBlock().call,
        contract.methods.endBlock().call,
        contract.methods.viewPoolInformation(0).call,
        contract.methods.viewPoolInformation(1).call,
      ])) as [string, string, PoolCharacteristics, PoolCharacteristics]

      const startBlockNum = parseInt(startBlock, 10)
      const endBlockNum = parseInt(endBlock, 10)

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress =
        currentBlock > startBlockNum
          ? ((currentBlock - startBlockNum) / totalBlocks) * 100
          : ((currentBlock - releaseBlockNumber) / (startBlockNum - releaseBlockNumber)) * 100

      setState({
        secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
        secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
        poolBasic: formatPool(poolBasic),
        poolUnlimited: formatPool(poolUnlimited),
        status,
        progress,
        blocksRemaining,
        startBlockNum,
        endBlockNum,
      })
    }

    fetchProgress()
  }, [address, currentBlock, contract, releaseBlockNumber, setState])

  return state
}

export default useGetPublicIfoData
