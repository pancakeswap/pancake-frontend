import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useBlock } from 'state/block/hooks'
import { useLpTokenPrice } from 'state/farms/hooks'
import useRefresh from 'hooks/useRefresh'
import { multicallv2 } from 'utils/multicall'
import ifoV2Abi from 'config/abi/ifoV2.json'
import { BIG_ZERO } from 'utils/bigNumber'
import { PublicIfoData } from '../../types'
import { getStatus } from '../helpers'

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = ethers.FixedNumber.from(10000000000)

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
  const { address, releaseBlockNumber } = ifo
  const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  const { fastRefresh } = useRefresh()

  const [state, setState] = useState({
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
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  })
  const { currentBlock } = useBlock()

  const fetchIfoData = useCallback(async () => {
    const ifoCalls = [
      {
        address,
        name: 'startBlock',
      },
      {
        address,
        name: 'endBlock',
      },
      {
        address,
        name: 'viewPoolInformation',
        params: [0],
      },
      {
        address,
        name: 'viewPoolInformation',
        params: [1],
      },
      {
        address,
        name: 'viewPoolTaxRateOverflow',
        params: [1],
      },
      {
        address,
        name: 'numberPoints',
      },
    ]

    const [startBlock, endBlock, poolBasic, poolUnlimited, taxRate, numberPoints] = await multicallv2(
      ifoV2Abi,
      ifoCalls,
    )

    const poolBasicFormatted = formatPool(poolBasic)
    const poolUnlimitedFormatted = formatPool(poolUnlimited)

    const startBlockNum = startBlock ? startBlock[0].toNumber() : 0
    const endBlockNum = endBlock ? endBlock[0].toNumber() : 0
    const taxRateNum = taxRate ? ethers.FixedNumber.from(taxRate[0]).divUnsafe(TAX_PRECISION).toUnsafeFloat() : 0

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
      secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
      secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
      poolBasic: { ...poolBasicFormatted, taxRate: 0 },
      poolUnlimited: { ...poolUnlimitedFormatted, taxRate: taxRateNum },
      status,
      progress,
      blocksRemaining,
      startBlockNum,
      endBlockNum,
      numberPoints: numberPoints ? numberPoints[0].toNumber() : 0,
    }))
  }, [address, currentBlock, releaseBlockNumber])

  useEffect(() => {
    fetchIfoData()
  }, [fetchIfoData, fastRefresh])

  return { ...state, currencyPriceInUSD: lpTokenPriceInUsd, fetchIfoData }
}

export default useGetPublicIfoData
