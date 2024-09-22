import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, useToast } from '@pancakeswap/uikit'
import { useSignMessage } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAffiliateProgramContract } from 'hooks/useContract'
import { useMemo, useState } from 'react'
import { encodePacked, keccak256 } from 'viem'
import SingleLatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleLatestReward'
import WrongNetworkWarning from 'views/AffiliatesProgram/components/Dashboard/Reward/WrongNetworkWarning'
import { UserClaimListResponse } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'
import { useAccount } from 'wagmi'

interface LatestRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
  userClaimData?: UserClaimListResponse
  affiliateClaimData?: UserClaimListResponse
  refreshAffiliateClaimData: () => void
  refreshUserClaimData: () => void
  refreshAuthAffiliate: () => void
}

const MIN_CLAIM_AMOUNT = 1

const LatestReward: React.FC<React.PropsWithChildren<LatestRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
  userClaimData,
  affiliateClaimData,
  refreshAffiliateClaimData,
  refreshUserClaimData,
  refreshAuthAffiliate,
}) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainId } = useActiveChainId()
  const { isUserExist } = useUserExist()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const cakePrice = useCakePrice()

  const [isAffiliateClaimLoading, setIsAffiliateClaimLoading] = useState(false)
  const [isUserClaimLoading, setIsUserClaimLoading] = useState(false)
  const contract = useAffiliateProgramContract({ chainId: ChainId.BSC })

  const affiliateTotalCakeEarned = useMemo(
    () => new BigNumber(affiliateRewardFeeUSD).div(cakePrice).toNumber(),
    [cakePrice, affiliateRewardFeeUSD],
  )
  const userTotalCakeEarned = useMemo(
    () => new BigNumber(userRewardFeeUSD).div(cakePrice).toNumber(),
    [cakePrice, userRewardFeeUSD],
  )

  const handleClaim = async (isAffiliateClaim: boolean) => {
    try {
      if (isAffiliateClaim) {
        setIsAffiliateClaimLoading(true)
      } else {
        setIsUserClaimLoading(true)
      }

      if (!address) return

      const method = isAffiliateClaim ? contract.read.getAffiliateInfo([address]) : contract.read.getUserInfo([address])
      const userInfo = await method
      const nonce = new BigNumber(userInfo?.nonce?.toString()).toNumber()
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const message = keccak256(encodePacked(['uint256', 'uint256'], [BigInt(nonce), BigInt(timestamp)]))
      const signature = await signMessageAsync({ message })

      const url = isAffiliateClaim ? 'affiliate-claim-fee' : 'user-claim-fee'
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
          await Promise.all([refreshAffiliateClaimData(), refreshAuthAffiliate()])
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
    const hasPendingOrUnClaimed =
      affiliateClaimData?.claimRequests?.filter(
        (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
      ) ?? []
    return (
      new BigNumber(affiliateRewardFeeUSD).lt(MIN_CLAIM_AMOUNT) ||
      hasPendingOrUnClaimed?.length > 0 ||
      isAffiliateClaimLoading
    )
  }, [affiliateClaimData, affiliateRewardFeeUSD, isAffiliateClaimLoading])

  const isUserClaimDisabled = useMemo(() => {
    const hasPendingOrUnClaimed =
      userClaimData?.claimRequests?.filter(
        (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
      ) ?? []
    return (
      new BigNumber(userRewardFeeUSD).lt(MIN_CLAIM_AMOUNT) ||
      hasPendingOrUnClaimed?.length > 0 ||
      isUserClaimLoading ||
      !isUserExist
    )
  }, [userClaimData, userRewardFeeUSD, isUserClaimLoading, isUserExist])

  return (
    <Box width="100%">
      {chainId !== ChainId.BSC && <WrongNetworkWarning />}
      {isAffiliate && (
        <Box mb="20px">
          <SingleLatestReward
            usdAmountTitle={t('Affiliate Reward')}
            usdAmount={Number(affiliateRewardFeeUSD)}
            cakeAmountTitle={t('Affiliate CAKE Earned')}
            cakeAmount={affiliateTotalCakeEarned}
            disabled={isAffiliateClaimDisabled}
            clickClaim={() => handleClaim(true)}
          />
        </Box>
      )}
      <SingleLatestReward
        usdAmountTitle={t('User Reward')}
        usdAmount={Number(userRewardFeeUSD)}
        cakeAmountTitle={t('User CAKE Earned')}
        cakeAmount={userTotalCakeEarned}
        disabled={isUserClaimDisabled}
        clickClaim={() => handleClaim(false)}
      />
    </Box>
  )
}

export default LatestReward
