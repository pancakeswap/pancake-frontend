import { useCallback } from 'react'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useTradingRewardContract } from 'hooks/useContract'
import { useAccount } from 'wagmi'
import { keccak256 } from '@ethersproject/keccak256'
import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const useClaimAllReward = (unclaimData: UserCampaignInfoDetail[]) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useTradingRewardContract()

  const handleClaim = useCallback(async () => {
    // const campaignIds = unclaimData.map((i) => [i.campaignId])
    // const merkleProofs = unclaimData.map((i) => {
    //   const volume = new BigNumber(i.totalVolume).div(1e18).toFixed(2)
    //   const leaf = keccak256(ethers.utils.encodePacked(account, volume))
    //   const hexProof = JSON.stringify(merkleTree.getHexProof(leaf))
    //   const merkleProof = JSON.parse(hexProof)
    //   return [merkleProof]
    // })
    // const selfVolumes = unclaimData.map((i) => [new BigNumber(i.totalVolume).div(1e18).toFixed(2)])
    // const receipt = await fetchWithCatchTxError(() => contract.claimRewardMulti(campaignIds, merkleProofs, selfVolumes))

    // if (receipt?.status) {
    //   toastSuccess(
    //     t('Success!'),
    //     <ToastDescriptionWithTx txHash={receipt.transactionHash}>
    //       {t('Your funds have been staked in the pool')}
    //     </ToastDescriptionWithTx>,
    //   )
    //   dispatch(fetchPotteryUserDataAsync(account))
    // }
    return null
  }, [])

  return { isPending, handleClaim }
}
