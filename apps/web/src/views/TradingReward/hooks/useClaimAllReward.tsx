import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import web3 from 'web3'
import { keccak256 } from '@ethersproject/keccak256'
import { useAccount } from 'wagmi'
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
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useTradingRewardContract()

  const handleClaim = useCallback(async () => {
    const campaignIds = unclaimData.map((i) => i.campaignId)
    const selfVolumes = unclaimData.map((i) => [Number(new BigNumber(i.totalVolume.toFixed(2)).times(1e18))])
    const merkleProofs = await Promise.all(
      unclaimData.map(async (i) => {
        const volume = new BigNumber(i.totalVolume.toFixed(2)).times(1e18).toString()
        const originHash = Buffer.from(`0x${keccak256(keccak256(web3.utils.encodePacked(account, volume)))}`, 'hex')
        const response = await fetch(
          `${TRADING_REWARD_API}/hash/chainId/${chainId}/campaignId/${i.campaignId}/originHash/${originHash}`,
        )
        const result = await response.json()
        return result.data
      }),
    )

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
  }, [account, chainId, contract, fetchWithCatchTxError, t, toastSuccess, unclaimData])

  return { isPending, handleClaim }
}
