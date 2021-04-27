import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useBlock, useLpTokenPrice } from 'state/hooks'
import { useIfoV2Contract } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
import makeBatchRequest from 'utils/makeBatchRequest'
import { PublicIfoData, PoolCharacteristics } from '../types'
import { getStatus } from '../helpers'

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = 10000000000

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
  const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  const { fastRefresh } = useRefresh()

  const [state, setState] = useState({
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: new BigNumber(0),
      offeringAmountPool: new BigNumber(0),
      limitPerUserInLP: new BigNumber(0),
      taxRate: 0,
      totalAmountPool: new BigNumber(0),
      sumTaxesOverflow: new BigNumber(0),
    },
    poolUnlimited: {
      raisingAmountPool: new BigNumber(0),
      offeringAmountPool: new BigNumber(0),
      limitPerUserInLP: new BigNumber(0),
      taxRate: 0,
      totalAmountPool: new BigNumber(0),
      sumTaxesOverflow: new BigNumber(0),
    },
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  })
  const { currentBlock } = useBlock()
  const contract = useIfoV2Contract(address)

  const fetchIfoData = useCallback(async () => {
    const [startBlock, endBlock, poolBasic, poolUnlimited, taxRate, numberPoints] = (await makeBatchRequest([
      contract.methods.startBlock().call,
      contract.methods.endBlock().call,
      contract.methods.viewPoolInformation(0).call,
      contract.methods.viewPoolInformation(1).call,
      contract.methods.viewPoolTaxRateOverflow(1).call,
      contract.methods.numberPoints().call,
    ])) as [string, string, PoolCharacteristics, PoolCharacteristics, number, number]

    const poolBasicFormatted = formatPool(poolBasic)
    const poolUnlimitedFormatted = formatPool(poolUnlimited)

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

    setState((prev) => ({
      ...prev,
      secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
      secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
      poolBasic: { ...poolBasicFormatted, taxRate: 0 },
      poolUnlimited: { ...poolUnlimitedFormatted, taxRate: taxRate / TAX_PRECISION },
      status,
      progress,
      blocksRemaining,
      startBlockNum,
      endBlockNum,
      numberPoints,
    }))
  }, [contract, currentBlock, releaseBlockNumber])

  useEffect(() => {
    fetchIfoData()
  }, [fetchIfoData, fastRefresh])

  return { ...state, currencyPriceInUSD: lpTokenPriceInUsd, fetchIfoData }
}

export default useGetPublicIfoData
