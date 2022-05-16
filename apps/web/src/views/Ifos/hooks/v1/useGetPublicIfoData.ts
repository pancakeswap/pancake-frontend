import { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus, PoolIds } from 'config/constants/types'
import { useLpTokenPrice } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { multicallv2 } from 'utils/multicall'
import ifoV1Abi from 'config/abi/ifoV1.json'
import { PublicIfoData } from '../../types'
import { getStatus } from '../helpers'

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address, releaseBlockNumber } = ifo
  const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  const [state, setState] = useState({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: null,
    thresholdPoints: undefined,
    [PoolIds.poolUnlimited]: {
      raisingAmountPool: BIG_ZERO,
      totalAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO, // Not know
      limitPerUserInLP: BIG_ZERO, //  Not used
      taxRate: 0, //  Not used
      sumTaxesOverflow: BIG_ZERO, //  Not used
    },
  })
  const fetchIfoData = useCallback(
    async (currentBlock: number) => {
      const ifoCalls = ['startBlock', 'endBlock', 'raisingAmount', 'totalAmount'].map((method) => ({
        address,
        name: method,
      }))

      const [startBlock, endBlock, raisingAmount, totalAmount] = await multicallv2(ifoV1Abi, ifoCalls)

      const startBlockNum = startBlock ? startBlock[0].toNumber() : 0
      const endBlockNum = endBlock ? endBlock[0].toNumber() : 0

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress =
        currentBlock > startBlockNum
          ? ((currentBlock - startBlockNum) / totalBlocks) * 100
          : ((currentBlock - releaseBlockNumber) / (startBlockNum - releaseBlockNumber)) * 100

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        status,
        blocksRemaining,
        secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
        progress,
        secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
        startBlockNum,
        endBlockNum,
        [PoolIds.poolUnlimited]: {
          ...prev.poolUnlimited,
          raisingAmountPool: raisingAmount ? new BigNumber(raisingAmount[0].toString()) : BIG_ZERO,
          totalAmountPool: totalAmount ? new BigNumber(totalAmount[0].toString()) : BIG_ZERO,
        },
      }))
    },
    [address, releaseBlockNumber],
  )

  return { ...state, currencyPriceInUSD: lpTokenPriceInUsd, fetchIfoData }
}

export default useGetPublicIfoData
