import BigNumber from 'bignumber.js'
import { useState, useCallback } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { bscTokens } from '@pancakeswap/tokens'
import { Ifo, IfoStatus } from '@pancakeswap/ifos'

import { useLpTokenPrice } from 'state/farms/hooks'
import { useCakePrice } from 'hooks/useCakePrice'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { PublicIfoData } from '../../types'
import { getStatus } from '../helpers'

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = new BigNumber(10000000000)

const formatPool = (pool) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address } = ifo
  const cakePrice = useCakePrice()
  const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  const currencyPriceInUSD = ifo.currency === bscTokens.cake ? cakePrice : lpTokenPriceInUsd

  const [state, setState] = useState({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    thresholdPoints: undefined,
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  })

  const fetchIfoData = useCallback(
    async (currentBlock: number) => {
      const client = publicClient({ chainId: ChainId.BSC })
      const [startBlock, endBlock, poolBasic, poolUnlimited, taxRate, numberPoints, thresholdPoints] =
        await client.multicall({
          contracts: [
            {
              abi: ifoV2ABI,
              address,
              functionName: 'startBlock',
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'endBlock',
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'viewPoolInformation',
              args: [0n],
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'viewPoolInformation',
              args: [1n],
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'viewPoolTaxRateOverflow',
              args: [1n],
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'numberPoints',
            },
            {
              abi: ifoV2ABI,
              address,
              functionName: 'thresholdPoints',
            },
          ],
          allowFailure: false,
        })

      const poolBasicFormatted = formatPool(poolBasic)
      const poolUnlimitedFormatted = formatPool(poolUnlimited)

      const startBlockNum = startBlock ? Number(startBlock) : 0
      const endBlockNum = endBlock ? Number(endBlock) : 0
      const taxRateNum = taxRate ? new BigNumber(taxRate.toString()).div(TAX_PRECISION).toNumber() : 0

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
            secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
            secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
            poolBasic: {
              ...poolBasicFormatted,
              taxRate: 0,
            },
            poolUnlimited: { ...poolUnlimitedFormatted, taxRate: taxRateNum },
            status,
            progress,
            blocksRemaining,
            startBlockNum,
            endBlockNum,
            thresholdPoints,
            numberPoints: numberPoints ? Number(numberPoints) : 0,
          } as any),
      )
    },
    [address],
  )

  return { ...state, currencyPriceInUSD, fetchIfoData } as any
}

export default useGetPublicIfoData
