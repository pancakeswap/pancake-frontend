import { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus, PoolIds } from '@pancakeswap/ifos'
import { useLpTokenPrice } from 'state/farms/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { ifoV1ABI } from 'config/abi/ifoV1'
import { PublicIfoData } from '../../types'
import { getStatus } from '../helpers'

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address } = ifo
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
      const ifoCalls = (['startBlock', 'endBlock', 'raisingAmount', 'totalAmount'] as const).map(
        (method) =>
          ({
            abi: ifoV1ABI,
            address,
            functionName: method,
          } as const),
      )

      const client = publicClient({ chainId: ChainId.BSC })

      const [startBlockResult, endBlockResult, raisingAmountResult, totalAmountResult] = await client.multicall({
        contracts: ifoCalls,
      })

      const [startBlock, endBlock, raisingAmount, totalAmount] = [
        startBlockResult.result,
        endBlockResult.result,
        raisingAmountResult.result,
        totalAmountResult.result,
      ]

      const startBlockNum = startBlock ? Number(startBlock) : 0
      const endBlockNum = endBlock ? Number(endBlock) : 0

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress = status === 'live' ? ((currentBlock - startBlockNum) / totalBlocks) * 100 : null

      setState(
        (prev) =>
          ({
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
              raisingAmountPool: raisingAmount ? new BigNumber(raisingAmount.toString()) : BIG_ZERO,
              totalAmountPool: totalAmount ? new BigNumber(totalAmount.toString()) : BIG_ZERO,
            },
          } as any),
      )
    },
    [address],
  )

  return { ...state, currencyPriceInUSD: lpTokenPriceInUsd, fetchIfoData } as any
}

export default useGetPublicIfoData
