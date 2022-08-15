import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { differenceInHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { getCakeVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: DeserializedPool
  account: string
}

const AutoEarningsBreakdown: React.FC<React.PropsWithChildren<AutoEarningsBreakdownProps>> = ({ pool, account }) => {
  const { t } = useTranslation()

  const { earningTokenPrice } = pool
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const { autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    userData.cakeAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.CakeVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedCakePerHour = hourDiffSinceLastAction ? autoCakeToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

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
    </>
  )
}

export default AutoEarningsBreakdown
