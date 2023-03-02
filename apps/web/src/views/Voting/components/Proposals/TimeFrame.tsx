import { Text } from '@pancakeswap/uikit'
import { toDate, format } from 'date-fns'
import { useTranslation } from '@pancakeswap/localization'
import { ProposalState } from 'state/types'

interface TimeFrameProps {
  startDate: number
  endDate: number
  proposalState: ProposalState
}

const getFormattedDate = (timestamp: number) => {
  const date = toDate(timestamp * 1000)
  return format(date, 'MMM do, yyyy HH:mm')
}

const TimeFrame: React.FC<React.PropsWithChildren<TimeFrameProps>> = ({ startDate, endDate, proposalState }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const textProps = {
    fontSize: '16px',
    color: 'textSubtle',
    ml: '8px',
  }

  if (proposalState === ProposalState.CLOSED) {
    return (
      <Text {...textProps}>
        {t('Ended %date%', {
          date: new Date(endDate).toLocaleString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        })}
      </Text>
    )
  }

  if (proposalState === ProposalState.PENDING) {
    return (
      <Text {...textProps}>
        {t('Starts %date%', {
          date: new Date(startDate).toLocaleString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        })}
      </Text>
    )
  }

  return <Text {...textProps}>{t('Ends %date%', { date: getFormattedDate(endDate) })}</Text>
}

export default TimeFrame
