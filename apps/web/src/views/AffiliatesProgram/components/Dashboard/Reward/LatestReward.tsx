import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
import SingleLatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleLatestReward'

interface LatestRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
}

const LatestReward: React.FC<React.PropsWithChildren<LatestRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
}) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeUSD()

  const affiliateTotalCakeEarned = useMemo(
    () => new BigNumber(affiliateRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, affiliateRewardFeeUSD],
  )
  const userTotalCakeEarned = useMemo(
    () => new BigNumber(userRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, userRewardFeeUSD],
  )

  const handleClaim = () => {
    console.log('123')
  }

  return (
    <>
      {isAffiliate && (
        <SingleLatestReward
          usdAmountTitle={t('Affiliate Reward')}
          usdAmount={Number(affiliateRewardFeeUSD)}
          cakeAmountTitle={t('Affiliate CAKE Earned')}
          cakeAmount={affiliateTotalCakeEarned}
          disabled={false}
          clickClaim={handleClaim}
        />
      )}
      <SingleLatestReward
        usdAmountTitle={t('User Reward')}
        usdAmount={Number(userRewardFeeUSD)}
        cakeAmountTitle={t('User CAKE Earned')}
        cakeAmount={userTotalCakeEarned}
        disabled={false}
        clickClaim={handleClaim}
      />
    </>
  )
}

export default LatestReward
