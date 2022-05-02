import { useTranslation } from 'contexts/Localization'
import { convertTimeToSeconds, distanceToNowStrict } from 'utils/timeHelper'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

interface UserData {
  lockEndTime: string
  lockStartTime: string
}

interface UserDataInVaultPresenter {
  weekDuration: string
  remainingTime: string
  lockEndDate: string
  secondDuration: number
}

type UserDataInVaultPresenterFn = (args: UserData) => UserDataInVaultPresenter

const useUserDataInVaultPresenter: UserDataInVaultPresenterFn = ({ lockEndTime, lockStartTime }) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const secondDuration = Number(lockEndTime) - Number(lockStartTime)

  const lockEndTimeSeconds = convertTimeToSeconds(lockEndTime)

  let lockEndDate = ''

  try {
    lockEndDate = new Date(lockEndTimeSeconds).toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch (_) {
    // ignore invalid format
  }

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingTime: distanceToNowStrict(lockEndTimeSeconds),
    lockEndDate,
    secondDuration,
  }
}

export default useUserDataInVaultPresenter
