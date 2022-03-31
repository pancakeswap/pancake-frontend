import format from 'date-fns/format'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import formatDuration from 'date-fns/formatDuration'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'
import convertLockTimeToSeconds from '../utils/convertLockTimeToSeconds'

const useUserDataInVaultPrensenter = (userData) => {
  const cakePriceBusd = useCakeBusdPrice()

  const secondDuration = userData?.lockEndTime - userData?.lockStartTime

  const cakeBalance = getBalanceNumber(userData?.lockedAmount)
  const usdValueStaked = multiplyPriceByAmount(cakePriceBusd, cakeBalance)

  const lockEndTimeSeconds = convertLockTimeToSeconds(userData?.lockEndTime)

  const diffWeeks = differenceInWeeks(new Date(lockEndTimeSeconds), new Date())

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingWeeks: formatDuration({ weeks: diffWeeks }),
    lockEndDate: format(lockEndTimeSeconds, 'MMM do, yyyy HH:mm'),
    lockedAmount: cakeBalance,
    usdValueStaked,
    secondDuration,
  }
}

export default useUserDataInVaultPrensenter
