import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import useSWR from 'swr'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@pancakeswap/sdk'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getCakeVaultAddress, getAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { getActivePools } from 'utils/calls'
import cakeVaultAbi from 'config/abi/cakeVaultV2.json'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { convertSharesToCake } from '../../../../views/Pools/helpers'
import { getScores } from '../../../../views/Voting/getScores'
import { PANCAKE_SPACE } from '../../../../views/Voting/config'
import * as strategies from '../../../../views/Voting/strategies'

const useCakeBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const cakeVaultAddress = getCakeVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useSWR(account && currentBscBlock && ['cakeBenefits', account], async () => {
    const userVaultCalls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }))

    const pricePerFullShareCall = [
      {
        address: cakeVaultAddress,
        name: 'getPricePerFullShare',
      },
    ]

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee], sharePrice] = await multicallv2({
      abi: cakeVaultAbi,
      calls: [...userVaultCalls, ...pricePerFullShareCall],
    })
    const currentPerformanceFeeAsBigNumber = new BigNumber(currentPerformanceFee.toString())
    const currentOverdueFeeAsBigNumber = new BigNumber(currentOverdueFee.toString())
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const userBoostedSharesAsBignumber = new BigNumber(userContractResponse.userBoostedShare.toString())
    const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
    const lockPosition = getVaultPosition({
      userShares: userSharesAsBignumber,
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
    })
    const lockedCake = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
      ? '0.00'
      : convertSharesToCake(
          userSharesAsBignumber,
          sharePriceAsBigNumber,
          undefined,
          undefined,
          currentOverdueFeeAsBigNumber.plus(currentPerformanceFeeAsBigNumber).plus(userBoostedSharesAsBignumber),
        ).cakeAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 })

    let iCake = ''
    let vCake = { vaultScore: '0', totalScore: '0' }
    if (lockPosition === VaultPosition.Locked) {
      const credit = await ifoCreditAddressContract.getUserCredit(account)
      iCake = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })

      const eligiblePools = await getActivePools(currentBscBlock)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC))

      const [cakeVaultBalance, total] = await getScores(
        PANCAKE_SPACE,
        [strategies.cakePoolBalanceStrategy('v1'), strategies.createTotalStrategy(poolAddresses, 'v1')],
        ChainId.BSC.toString(),
        [account],
        currentBscBlock,
      )
      vCake = {
        vaultScore: cakeVaultBalance[account]
          ? cakeVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
          : '0',
        totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
      }
    }

    return {
      lockedCake,
      lockPosition,
      lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }),
      iCake,
      vCake,
    }
  })

  return { data, status }
}

export default useCakeBenefits
