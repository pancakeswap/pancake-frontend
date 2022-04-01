import format from 'date-fns/format'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import formatDuration from 'date-fns/formatDuration'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'
import convertLockTimeToSeconds from '../utils/convertLockTimeToSeconds'

interface UserData {
  lockEndTime: string
  lockStartTime: string
}

interface UserDataInVaultPrensenter {
  weekDuration: string
  remainingWeeks: string
  lockEndDate: string
  secondDuration: number
}

type UserDataInVaultPrensenterFn = (args: UserData) => UserDataInVaultPrensenter

const useUserDataInVaultPrensenter: UserDataInVaultPrensenterFn = ({ lockEndTime, lockStartTime }) => {
  const secondDuration = Number(lockEndTime) - Number(lockStartTime)

  const lockEndTimeSeconds = convertLockTimeToSeconds(lockEndTime)

  const diffWeeks = differenceInWeeks(new Date(lockEndTimeSeconds), new Date(), { roundingMethod: 'round' })

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingWeeks: formatDuration({ weeks: diffWeeks }),
    lockEndDate: format(lockEndTimeSeconds, 'MMM do, yyyy HH:mm'),
    secondDuration,
  }
}

export default useUserDataInVaultPrensenter
