import { useCallback } from 'react'
import web3 from 'web3'
import { useAccount } from 'wagmi'
import { keccak256 } from '@ethersproject/keccak256'
import BigNumber from 'bignumber.js'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useTradingRewardContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MerkleTree } from 'merkletreejs'

export const useClaimAllReward = (unclaimData: UserCampaignInfoDetail[]) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useTradingRewardContract()

  const handleClaim = useCallback(async () => {
    const campaignIds = unclaimData.map((i) => i.campaignId)
    const selfVolumes = unclaimData.map((i) => [Number(new BigNumber(i.totalVolume).div(1e18).toFixed(2))])

    const merkleProofs = unclaimData.map((i) => {
      const volume = new BigNumber(i.totalVolume).div(1e18).toFixed(2)
      const leaf = Buffer.from(`0x${keccak256(keccak256(web3.utils.encodePacked(account, volume)))}`, 'utf8').toString(
        'hex',
      )
      const tree = new MerkleTree([leaf], keccak256, { sortPairs: true })
      const hexProof = JSON.stringify(tree.getHexProof(leaf))
      const merkleProof = JSON.parse(hexProof)
      return merkleProof
    })

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
  }, [account, contract, fetchWithCatchTxError, t, toastSuccess, unclaimData])

  return { isPending, handleClaim }
}
