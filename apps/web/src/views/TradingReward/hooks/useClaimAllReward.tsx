import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useTradingRewardContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

export const useClaimAllReward = (unclaimData: UserCampaignInfoDetail[]) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useTradingRewardContract()

  const handleClaim = useCallback(async () => {
    const campaignIds = unclaimData.map((i) => i.campaignId)
    const selfVolumes = unclaimData.map((i) => [Number(new BigNumber(i.totalVolume.toFixed(2)).div(1e18))])

    const merkleProofsData = await Promise.all(
      unclaimData.map(async (i) => {
        const response = await fetch(`${TRADING_REWARD_API}/hash/chainId/${chainId}/campaignId/${i.campaignId}`)
        const result = await response.json()
        return { merkleProof: result.data }
      }),
    )

    const merkleProofs = merkleProofsData.map((i) => i.merkleProof)

    const receipt = await fetchWithCatchTxError(() => contract.claimRewardMulti(campaignIds, merkleProofs, selfVolumes))

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
      // dispatch(fetchPotteryUserDataAsync(account))
    }
    return null
  }, [chainId, contract, fetchWithCatchTxError, t, toastSuccess, unclaimData])

  return { isPending, handleClaim }
}
