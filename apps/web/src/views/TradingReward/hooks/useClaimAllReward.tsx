import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useSWRConfig } from 'swr'
import { solidityPack } from 'ethers/lib/utils'
import { utils } from 'ethers'
import { keccak256 } from '@ethersproject/keccak256'
import { useAccount } from 'wagmi'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useTradingRewardContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { Qualification } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface UseClaimAllRewardProps {
  campaignIds: Array<string>
  unclaimData: UserCampaignInfoDetail[]
  qualification: Qualification
}

export const useClaimAllReward = ({ campaignIds, unclaimData, qualification }: UseClaimAllRewardProps) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useTradingRewardContract()
  const { mutate } = useSWRConfig()

  const handleClaim = useCallback(async () => {
    const claimCampaignIds = unclaimData.map((i) => i.campaignId)
    const tradingFee = unclaimData.map((i) => {
      const isQualification = new BigNumber(i.totalTradingFee).gt(new BigNumber(qualification.minAmountUSD).div(1e18))
      const totalFee = isQualification ? i.totalTradingFee.toFixed(8) : i.totalTradingFee.toString()
      return new BigNumber(totalFee).times(1e18).toString()
    })

    const merkleProofs = await Promise.all(
      unclaimData.map(async (i) => {
        const isQualification = new BigNumber(i.totalTradingFee).gt(new BigNumber(qualification.minAmountUSD).div(1e18))
        const totalFee = isQualification ? i.totalTradingFee.toFixed(8) : i.totalTradingFee.toString()
        const value = utils.parseEther(totalFee)
        const originHash = keccak256(keccak256(solidityPack(['address', 'uint256'], [account, value])))

        const response = await fetch(`${TRADING_REWARD_API}/hash/campaignId/${i.campaignId}/originHash/${originHash}`)
        const result = await response.json()
        return result.data.merkleProof
      }),
    )

    const receipt = await fetchWithCatchTxError(() =>
      contract.claimRewardMulti(claimCampaignIds, merkleProofs, tradingFee),
    )

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
      void mutate(['/all-campaign-id-info', account, campaignIds])
    }
    return null
  }, [account, campaignIds, contract, fetchWithCatchTxError, mutate, qualification, t, toastSuccess, unclaimData])

  return { isPending, handleClaim }
}
