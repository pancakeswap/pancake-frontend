import format from 'date-fns/format'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import formatDuration from 'date-fns/formatDuration'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { multiplyPriceByAmount } from 'utils/prices'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'
import convertLockTimeToSeconds from '../utils/convertLockTimeToSeconds'

interface UserData {
  lockEndTime: string
  lockStartTime: string
  lockedAmount: BigNumber
}

interface UserDataInVaultPrensenter {
  weekDuration: string
  remainingWeeks: string
  lockEndDate: string
  lockedAmount: number
  usdValueStaked: number
  secondDuration: number
}

type UserDataInVaultPrensenterFn = (args: UserData) => UserDataInVaultPrensenter

const useUserDataInVaultPrensenter: UserDataInVaultPrensenterFn = ({ lockEndTime, lockStartTime, lockedAmount }) => {
  const cakePriceBusd = useCakeBusdPrice()

  const secondDuration = lockEndTime - lockStartTime

  const cakeBalance = getBalanceNumber(lockedAmount)
  const usdValueStaked = multiplyPriceByAmount(cakePriceBusd, cakeBalance)

  const lockEndTimeSeconds = convertLockTimeToSeconds(lockEndTime)

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
