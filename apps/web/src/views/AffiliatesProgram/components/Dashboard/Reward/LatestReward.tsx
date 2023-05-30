import { useMemo, useState } from 'react'
import { useSignMessage } from '@pancakeswap/wagmi'
import { useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { encodePacked, keccak256, toBytes } from 'viem'
import { ChainId } from '@pancakeswap/sdk'
import { usePriceCakeUSD } from 'state/farms/hooks'
import SingleLatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleLatestReward'
import { UserClaimListResponse } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { useAffiliateProgramContract } from 'hooks/useContract'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'

interface LatestRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
  userClaimData: UserClaimListResponse
  affiliateClaimData: UserClaimListResponse
  refreshAffiliateClaimData: () => void
  refreshUserClaimData: () => void
}

const LatestReward: React.FC<React.PropsWithChildren<LatestRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
  userClaimData,
  affiliateClaimData,
  refreshAffiliateClaimData,
  refreshUserClaimData,
}) => {
  const { t } = useTranslation()
  const { address, connector } = useAccount()
  const { isUserExist } = useUserExist()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const cakePriceBusd = usePriceCakeUSD()

  const [isAffiliateClaimLoading, setIsAffiliateClaimLoading] = useState(false)
  const [isUserClaimLoading, setIsUserClaimLoading] = useState(false)
  const contract = useAffiliateProgramContract({ chainId: ChainId.BSC })

  const affiliateTotalCakeEarned = useMemo(
    () => new BigNumber(affiliateRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, affiliateRewardFeeUSD],
  )
  const userTotalCakeEarned = useMemo(
    () => new BigNumber(userRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, userRewardFeeUSD],
  )

  const handleClaim = async (isAffiliateClaim: boolean) => {
    try {
      if (isAffiliateClaim) {
        setIsAffiliateClaimLoading(true)
      } else {
        setIsUserClaimLoading(true)
      }

      const method = isAffiliateClaim ? contract.read.getAffiliateInfo([address]) : contract.read.getUserInfo([address])
      const userInfo = (await method) as { nonce: number; totalClaimedAmount: number }
      const nonce = new BigNumber(userInfo?.nonce?.toString()).toNumber()
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const message =
        connector?.id === 'bsc'
          ? keccak256(encodePacked(['uint256', 'uint256'], [BigInt(nonce), BigInt(timestamp)]))
          : toBytes(keccak256(encodePacked(['uint256', 'uint256'], [BigInt(nonce), BigInt(timestamp)])))
      const signature = await signMessageAsync({ message: message as any })

      const url = isAffiliateClaim ? 'affiliates-claim-fee' : 'user-claim-fee'
      const response = await fetch(`/api/affiliates-program/${url}`, {
        method: 'POST',
        body: JSON.stringify({
          claimRequest: {
            address,
            nonce,
            timestamp,
            signature,
          },
        }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        toastSuccess(t('Success!'))
        if (isAffiliateClaim) {
          await refreshAffiliateClaimData()
        } else {
          await refreshUserClaimData()
        }
      } else {
        toastError(result?.error || '')
      }
    } catch (error) {
      console.error(`Submit Claim Reward Error: ${error}`)
    } finally {
      if (isAffiliateClaim) {
        setIsAffiliateClaimLoading(false)
      } else {
        setIsUserClaimLoading(false)
      }
    }
  }

  const isAffiliateClaimDisabled = useMemo(() => {
    const hasPendingOrUnClaimed = affiliateClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
    )
    return new BigNumber(affiliateRewardFeeUSD).lte(0) || hasPendingOrUnClaimed?.length > 0 || isAffiliateClaimLoading
  }, [affiliateClaimData, affiliateRewardFeeUSD, isAffiliateClaimLoading])

  const isUserClaimDisabled = useMemo(() => {
    const hasPendingOrUnClaimed = userClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
    )
    return (
      new BigNumber(userRewardFeeUSD).lte(0) || hasPendingOrUnClaimed?.length > 0 || isUserClaimLoading || !isUserExist
    )
  }, [isUserClaimLoading, userClaimData, userRewardFeeUSD, isUserExist])

  return (
    <>
      {isAffiliate && (
        <SingleLatestReward
          usdAmountTitle={t('Affiliate Reward')}
          usdAmount={Number(affiliateRewardFeeUSD)}
          cakeAmountTitle={t('Affiliate CAKE Earned')}
          cakeAmount={affiliateTotalCakeEarned}
          disabled={isAffiliateClaimDisabled}
          clickClaim={() => handleClaim(true)}
        />
      )}
      <SingleLatestReward
        usdAmountTitle={t('User Reward')}
        usdAmount={Number(userRewardFeeUSD)}
        cakeAmountTitle={t('User CAKE Earned')}
        cakeAmount={userTotalCakeEarned}
        disabled={isUserClaimDisabled}
        clickClaim={() => handleClaim(false)}
      />
    </>
  )
}

export default LatestReward
