import { useMemo, useState } from 'react'
import { useSignMessage } from '@pancakeswap/wagmi'
import { useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import { useAccount } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { usePriceCakeUSD } from 'state/farms/hooks'
import SingleLatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleLatestReward'
import { UserClaimListResponse } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { getAffiliateProgramContract } from 'utils/contractHelpers'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'

interface LatestRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
  userClaimData: UserClaimListResponse
  affiliateClaimData: UserClaimListResponse
}

const LatestReward: React.FC<React.PropsWithChildren<LatestRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
  userClaimData,
  affiliateClaimData,
}) => {
  const { t } = useTranslation()
  const { address, connector } = useAccount()
  const { isUserExist } = useUserExist()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const cakePriceBusd = usePriceCakeUSD()

  const [isAffiliateClaimLoading, setIsAffiliateClaimLoading] = useState(false)
  const [isUserClaimLoading, setIsUserClaimLoading] = useState(false)
  const contract = getAffiliateProgramContract(ChainId.BSC_TESTNET)

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

      const method = isAffiliateClaim ? contract.getAffiliateInfo(address) : contract.getUserInfo(address)
      const userInfo = await method
      const nonce = new BigNumber(userInfo?.nonce?.toString()).toNumber()
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const message =
        connector?.id === 'bsc'
          ? utils.solidityKeccak256(['uint256', 'uint256'], [nonce, timestamp])
          : utils.arrayify(utils.solidityKeccak256(['uint256', 'uint256'], [nonce, timestamp]))

      const signature = await signMessageAsync({ message })
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

  const isAffiliateClaimEnabled = useMemo(() => {
    const hasPendingOrUnClaimed = affiliateClaimData?.claimRequests?.find(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && i.process),
    )
    return (
      new BigNumber(affiliateRewardFeeUSD).gt(0) &&
      !isAffiliateClaimLoading &&
      (affiliateClaimData?.total === 0 || hasPendingOrUnClaimed !== undefined)
    )
  }, [affiliateClaimData, affiliateRewardFeeUSD, isAffiliateClaimLoading])

  const isUserClaimEnabled = useMemo(() => {
    const hasPendingOrUnClaimed = userClaimData?.claimRequests?.find(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && i.process),
    )
    return (
      new BigNumber(userRewardFeeUSD).gt(0) &&
      !!isUserExist &&
      !isUserClaimLoading &&
      (userClaimData?.total === 0 || hasPendingOrUnClaimed !== undefined)
    )
  }, [isUserClaimLoading, isUserExist, userClaimData, userRewardFeeUSD])

  return (
    <>
      {isAffiliate && (
        <SingleLatestReward
          usdAmountTitle={t('Affiliate Reward')}
          usdAmount={Number(affiliateRewardFeeUSD)}
          cakeAmountTitle={t('Affiliate CAKE Earned')}
          cakeAmount={affiliateTotalCakeEarned}
          disabled={!isAffiliateClaimEnabled}
          clickClaim={() => handleClaim(true)}
        />
      )}
      <SingleLatestReward
        usdAmountTitle={t('User Reward')}
        usdAmount={Number(userRewardFeeUSD)}
        cakeAmountTitle={t('User CAKE Earned')}
        cakeAmount={userTotalCakeEarned}
        disabled={!isUserClaimEnabled}
        clickClaim={() => handleClaim(false)}
      />
    </>
  )
}

export default LatestReward
