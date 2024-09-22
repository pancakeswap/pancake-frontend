import BigNumber from 'bignumber.js'
import { useState, useCallback } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import round from 'lodash/round'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { ifoV3ABI } from 'config/abi/ifoV3'
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

const NO_QUALIFIED_NFT_ADDRESS = '0x0000000000000000000000000000000000000000'

const formatPool = (pool) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

const formatVestingInfo = (pool) => ({
  percentage: pool ? Number(pool[0]) : 0,
  cliff: pool ? Number(pool[1]) : 0,
  duration: pool ? Number(pool[2]) : 0,
  slicePeriodSeconds: pool ? Number(pool[3]) : 0,
})

const ROUND_DIGIT = 3

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address, plannedStartTime } = ifo
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
      distributionRatio: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
      pointThreshold: 0,
      admissionProfile: undefined,
      vestingInformation: {
        percentage: 0,
        cliff: 0,
        duration: 0,
        slicePeriodSeconds: 0,
      },
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      distributionRatio: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
      vestingInformation: {
        percentage: 0,
        cliff: 0,
        duration: 0,
        slicePeriodSeconds: 0,
      },
    },
    thresholdPoints: undefined,
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
    vestingStartTime: 0,
    plannedStartTime: 0,
  })

  const fetchIfoData = useCallback(
    async (currentBlock: number) => {
      const client = publicClient({ chainId: ChainId.BSC })
      const [
        startBlock,
        endBlock,
        poolBasic,
        poolUnlimited,
        taxRate,
        numberPoints,
        thresholdPoints,
        privateSaleTaxRate,
      ] = await client.multicall({
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
          {
            abi: ifoV2ABI,
            address,
            functionName: 'viewPoolTaxRateOverflow',
            args: [0n],
          },
        ],
        allowFailure: false,
      })

      const [admissionProfile, pointThreshold, vestingStartTime, basicVestingInformation, unlimitedVestingInformation] =
        await client.multicall({
          contracts: [
            {
              abi: ifoV3ABI,
              address,
              functionName: 'admissionProfile',
            },
            {
              abi: ifoV3ABI,
              address,
              functionName: 'pointThreshold',
            },
            {
              abi: ifoV3ABI,
              address,
              functionName: 'vestingStartTime',
            },
            {
              abi: ifoV3ABI,
              address,
              functionName: 'viewPoolVestingInformation',
              args: [0n],
            },
            {
              abi: ifoV3ABI,
              address,
              functionName: 'viewPoolVestingInformation',
              args: [1n],
            },
          ],
          allowFailure: true,
        })

      const poolBasicFormatted = formatPool(poolBasic)
      const poolUnlimitedFormatted = formatPool(poolUnlimited)

      const startBlockNum = startBlock ? Number(startBlock) : 0
      const endBlockNum = endBlock ? Number(endBlock) : 0
      const taxRateNum = taxRate ? new BigNumber(taxRate.toString()).div(TAX_PRECISION).toNumber() : 0
      const privateSaleTaxRateNum = privateSaleTaxRate
        ? new BigNumber(privateSaleTaxRate.toString()).div(TAX_PRECISION).toNumber()
        : 0

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress = status === 'live' ? ((currentBlock - startBlockNum) / totalBlocks) * 100 : null

      const totalOfferingAmount = poolBasicFormatted.offeringAmountPool.plus(poolUnlimitedFormatted.offeringAmountPool)

      setState(
        (prev) =>
          ({
            ...prev,
            isInitialized: true,
            secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
            secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
            poolBasic: {
              ...poolBasicFormatted,
              taxRate: privateSaleTaxRateNum,
              distributionRatio: round(
                poolBasicFormatted.offeringAmountPool.div(totalOfferingAmount).toNumber(),
                ROUND_DIGIT,
              ),
              pointThreshold: pointThreshold.result ? Number(pointThreshold.result) : 0,
              admissionProfile:
                Boolean(admissionProfile && admissionProfile.result) &&
                admissionProfile.result !== NO_QUALIFIED_NFT_ADDRESS
                  ? admissionProfile.result
                  : undefined,
              vestingInformation: formatVestingInfo(basicVestingInformation.result),
            },
            poolUnlimited: {
              ...poolUnlimitedFormatted,
              taxRate: taxRateNum,
              distributionRatio: round(
                poolUnlimitedFormatted.offeringAmountPool.div(totalOfferingAmount).toNumber(),
                ROUND_DIGIT,
              ),
              vestingInformation: formatVestingInfo(unlimitedVestingInformation.result),
            },
            status,
            progress,
            blocksRemaining,
            startBlockNum,
            endBlockNum,
            thresholdPoints,
            numberPoints: numberPoints ? Number(numberPoints) : 0,
            plannedStartTime: plannedStartTime ?? 0,
            vestingStartTime: vestingStartTime.result ? Number(vestingStartTime.result) : 0,
          } as any),
      )
    },
    [plannedStartTime, address],
  )

  return { ...state, currencyPriceInUSD, fetchIfoData } as any
}

export default useGetPublicIfoData
