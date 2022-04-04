import BigNumber from 'bignumber.js'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { getBalanceNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { differenceInHours } from 'date-fns'
import { convertSharesToCake, getCakeVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: DeserializedPool
  account: string
}

const getAutoEarningsInterestBreakdown = (
  pool: DeserializedPool,
  lastActionInMs: number,
  earningTokenDollarBalance: number,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  performanceFeeAsDecimal: number,
) => {
  const { stakingTokenPrice, earningTokenPrice, rawApr } = pool
  const autoCompoundFrequency = vaultPoolConfig[pool.vaultKey]?.autoCompoundFrequency ?? 0

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)
  return getInterestBreakdown({
    principalInUSD: getBalanceNumber(cakeAsBigNumber.times(stakingTokenPrice)),
    apr: rawApr,
    earningTokenPrice,
    compoundFrequency: autoCompoundFrequency,
    performanceFee: performanceFeeAsDecimal,
  })
}

const getAutoEarningsRoiTimePeriod = (timePeriod: number, interestBreakdown, earningTokenPrice) => {
  const hasInterest = Number.isFinite(interestBreakdown[timePeriod])
  const roiTokens = hasInterest ? interestBreakdown[timePeriod] : 0
  return hasInterest ? roiTokens * earningTokenPrice : 0
}

const AutoEarningsBreakdown: React.FC<AutoEarningsBreakdownProps> = ({ pool, account }) => {
  const { t } = useTranslation()

  const { earningTokenPrice } = pool
  const {
    userData: { cakeAtLastUserAction, userShares, lastUserActionTime, currentOverdueFee, currentPerformanceFee },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    currentPerformanceFee.plus(currentOverdueFee),
  )

  const lastActionInMs = lastUserActionTime ? parseInt(lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedCakePerHour = hourDiffSinceLastAction ? autoCakeToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

  const interestBreakdown = getAutoEarningsInterestBreakdown(
    pool,
    lastActionInMs,
    autoUsdToDisplay,
    userShares,
    pricePerFullShare,
    performanceFeeAsDecimal,
  )

  const roiDay = getAutoEarningsRoiTimePeriod(0, interestBreakdown, earningTokenPrice)
  const roiWeek = getAutoEarningsRoiTimePeriod(1, interestBreakdown, earningTokenPrice)
  const roiMonth = getAutoEarningsRoiTimePeriod(2, interestBreakdown, earningTokenPrice)
  const roiYear = getAutoEarningsRoiTimePeriod(3, interestBreakdown, earningTokenPrice)

  return (
    <>
      <Text bold>
        {autoCakeToDisplay.toFixed(3)}
        {' CAKE'}
      </Text>
      <Text bold>~${autoUsdToDisplay.toFixed(2)}</Text>
      <Text>{t('Earned since your last action')}:</Text>
      <Text>{new Date(lastActionInMs).toLocaleString()}</Text>
      {hourDiffSinceLastAction ? (
        <>
          <Text>{t('Your average per hour')}:</Text>
          <Text bold>{t('CAKE per hour: %amount%', { amount: earnedCakePerHour.toFixed(2) })}</Text>
          <Text bold>{t('per hour: ~$%amount%', { amount: earnedUsdPerHour.toFixed(2) })}</Text>
        </>
      ) : null}
      <Text>{t('At this rate, you would earn')}:</Text>
      <Text bold>{t('per 1d: ~$%amount%', { amount: roiDay.toFixed(2) })}</Text>
      <Text bold>{t('per 7d: ~$%amount%', { amount: roiWeek.toFixed(2) })}</Text>
      <Text bold>{t('per 30d: ~$%amount%', { amount: roiMonth.toFixed(2) })}</Text>
      <Text bold>{t('per 365d: ~$%amount%', { amount: roiYear.toFixed(2) })}</Text>
    </>
  )
}

export default AutoEarningsBreakdown
