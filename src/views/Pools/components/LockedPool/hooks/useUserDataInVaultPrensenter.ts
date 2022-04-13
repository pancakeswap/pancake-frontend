import format from 'date-fns/format'
import { convertTimeToSeconds, distanceToNowStrict } from 'utils/timeHelper'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

interface UserData {
  lockEndTime: string
  lockStartTime: string
}

interface UserDataInVaultPrensenter {
  weekDuration: string
  remainingTime: string
  lockEndDate: string
  secondDuration: number
}

type UserDataInVaultPrensenterFn = (args: UserData) => UserDataInVaultPrensenter

const useUserDataInVaultPrensenter: UserDataInVaultPrensenterFn = ({ lockEndTime, lockStartTime }) => {
  const secondDuration = Number(lockEndTime) - Number(lockStartTime)

  const lockEndTimeSeconds = convertTimeToSeconds(lockEndTime)

  let lockEndDate = ''

  try {
    lockEndDate = format(lockEndTimeSeconds, 'MMM do, yyyy HH:mm')
  } catch (_) {
    // ignore invalid format
  }

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingTime: distanceToNowStrict(lockEndTime),
    lockEndDate,
    secondDuration,
  }
}

export default useUserDataInVaultPrensenter
