import { Text } from '@pancakeswap/uikit'
import { toDate } from 'date-fns'
import { useTranslation } from '@pancakeswap/localization'
import { ProposalState } from 'state/types'

interface TimeFrameProps {
  startDate: number
  endDate: number
  proposalState: ProposalState
}

const GetFormattedDate = (timestamp: number) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()

  const date = toDate(timestamp * 1000)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const TimeFrame: React.FC<React.PropsWithChildren<TimeFrameProps>> = ({ startDate, endDate, proposalState }) => {
  const { t } = useTranslation()
  const textProps = {
    fontSize: '16px',
    color: 'textSubtle',
    ml: '8px',
  }

  if (proposalState === ProposalState.CLOSED) {
    return (
      <Text {...textProps}>
        {t('Ended %date%', {
          date: GetFormattedDate(endDate),
        })}
      </Text>
    )
  }

  if (proposalState === ProposalState.PENDING) {
    return (
      <Text {...textProps}>
        {t('Starts %date%', {
          date: GetFormattedDate(startDate),
        })}
      </Text>
    )
  }

  return (
    <Text {...textProps}>
      {t('Ends %date%', {
        date: GetFormattedDate(endDate),
      })}
    </Text>
  )
}

export default TimeFrame
