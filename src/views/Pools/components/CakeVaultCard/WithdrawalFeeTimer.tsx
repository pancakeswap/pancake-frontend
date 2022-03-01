import { Text } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import { useTranslation } from 'contexts/Localization'

const WithdrawalFeeTimer: React.FC<{ secondsRemaining: number }> = ({ secondsRemaining }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return <Text fontSize="14px">{t('%day%d : %hour%h : %minute%m', { day: days, hour: hours, minute: minutes })}</Text>
}

export default WithdrawalFeeTimer
