import { Ifo, IfoStatus, ifoV8ABI } from '@pancakeswap/ifos'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import round from 'lodash/round'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import { useLpTokenPrice } from 'state/farms/hooks'
import { publicClient } from 'utils/wagmi'

import { PublicIfoData } from '../../types'
import { getStatusByTimestamp } from '../helpers'

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = new BigNumber(10000000000)

const NO_QUALIFIED_NFT_ADDRESS = '0x0000000000000000000000000000000000000000'

const formatPool = (pool: readonly [bigint, bigint, bigint, boolean, bigint, bigint, number]) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
  saleType: pool ? pool[6] : 0,
})

const formatVestingInfo = (pool: readonly [bigint, bigint, bigint, bigint]) => ({
  percentage: pool ? Number(pool[0]) : 0,
  cliff: pool ? Number(pool[1]) : 0,
  duration: pool ? Number(pool[2]) : 0,
  slicePeriodSeconds: pool ? Number(pool[3]) : 0,
})

const ROUND_DIGIT = 3

const INITIAL_STATE = {
  isInitialized: false,
  status: 'idle' as IfoStatus,
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

    // 0: public sale
    // 1: private sale
    // 2: basic sale
    saleType: undefined,
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
    saleType: undefined,
  },
  thresholdPoints: undefined,
  startTimestamp: 0,
  endTimestamp: 0,
  numberPoints: 0,
  vestingStartTime: 0,
  plannedStartTime: 0,
}

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { chainId: currentChainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { chainId } = ifo
  const { address, plannedStartTime } = ifo
  const cakePrice = useCakePrice()
  const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  const currencyPriceInUSD = ifo.currency === CAKE[ifo.chainId] ? cakePrice : lpTokenPriceInUsd

  const [state, setState] = useState(INITIAL_STATE)

  const fetchIfoData = useCallback(async () => {
    const client = publicClient({ chainId })
    const [
      [startTimestamp, endTimestamp, poolBasic, poolUnlimited, taxRate, pointConfig, privateSaleTaxRate],
      [admissionProfile, pointThreshold, vestingStartTime, basicVestingInformation, unlimitedVestingInformation],
    ] = await Promise.all([
      client.multicall({
        contracts: [
          {
            abi: ifoV8ABI,
            address,
            functionName: 'startTimestamp',
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'endTimestamp',
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolInformation',
            args: [0n],
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolInformation',
            args: [1n],
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolTaxRateOverflow',
            args: [1n],
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'pointConfig',
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolTaxRateOverflow',
            args: [0n],
          },
        ],
        allowFailure: false,
      }),
      client.multicall({
        contracts: [
          {
            abi: ifoV8ABI,
            address,
            functionName: 'addresses',
            args: [5n],
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'pointThreshold',
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'vestingStartTime',
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolVestingInformation',
            args: [0n],
          },
          {
            abi: ifoV8ABI,
            address,
            functionName: 'viewPoolVestingInformation',
            args: [1n],
          },
        ],
        allowFailure: true,
      }),
    ])
    const [, numberPoints, thresholdPoints] = pointConfig

    const poolBasicFormatted = formatPool(poolBasic)
    const poolUnlimitedFormatted = formatPool(poolUnlimited)

    const startTime = Number(startTimestamp) || 0
    const endTime = Number(endTimestamp) || 0
    const taxRateNum = taxRate ? new BigNumber(taxRate.toString()).div(TAX_PRECISION).toNumber() : 0
    const privateSaleTaxRateNum = privateSaleTaxRate
      ? new BigNumber(privateSaleTaxRate.toString()).div(TAX_PRECISION).toNumber()
      : 0

    const now = Math.floor(Date.now() / 1000)
    const status = getStatusByTimestamp(now, startTime, endTime)
    const duration = endTime - startTime
    const secondsUntilEnd = endTime - now

    // Calculate the total progress until finished or until start
    const progress = status === 'live' ? ((now - startTime) / duration) * 100 : null

    const totalOfferingAmount = poolBasicFormatted.offeringAmountPool.plus(poolUnlimitedFormatted.offeringAmountPool)

    setState(
      (prev) =>
        ({
          ...prev,
          isInitialized: true,
          secondsUntilEnd,
          secondsUntilStart: startTime - now,
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
            vestingInformation: formatVestingInfo(basicVestingInformation.result || [0n, 0n, 0n, 0n]),
          },
          poolUnlimited: {
            ...poolUnlimitedFormatted,
            taxRate: taxRateNum,
            distributionRatio: round(
              poolUnlimitedFormatted.offeringAmountPool.div(totalOfferingAmount).toNumber(),
              ROUND_DIGIT,
            ),
            vestingInformation: formatVestingInfo(unlimitedVestingInformation.result || [0n, 0n, 0n, 0n]),
          },
          status,
          progress,
          startTimestamp: startTime,
          endTimestamp: endTime,
          thresholdPoints,
          numberPoints: numberPoints ? Number(numberPoints) : 0,
          plannedStartTime: plannedStartTime ?? 0,
          vestingStartTime: vestingStartTime.result ? Number(vestingStartTime.result) : 0,
        } as any),
    )
  }, [plannedStartTime, address, chainId])

  useEffect(() => setState(INITIAL_STATE), [currentChainId, account])

  return { ...state, currencyPriceInUSD, fetchIfoData } as any
}

export default useGetPublicIfoData
