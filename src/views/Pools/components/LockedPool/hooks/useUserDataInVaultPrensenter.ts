import { useTranslation } from 'contexts/Localization'
import format from 'date-fns/format'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import formatDuration from 'date-fns/formatDuration'
import { convertTimeToSeconds } from 'utils/timeHelper'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

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
  const { t } = useTranslation()
  const secondDuration = Number(lockEndTime) - Number(lockStartTime)

  const lockEndTimeSeconds = convertTimeToSeconds(lockEndTime)

  const remainingWeeks = differenceInWeeks(new Date(lockEndTimeSeconds), new Date(), { roundingMethod: 'round' })
  const remainingWeeksText = remainingWeeks > 0 ? formatDuration({ weeks: remainingWeeks }) : `0 ${t('week')}`

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingWeeks: remainingWeeksText,
    lockEndDate: format(lockEndTimeSeconds, 'MMM do, yyyy HH:mm'),
    secondDuration,
  }
}

export default useUserDataInVaultPrensenter
