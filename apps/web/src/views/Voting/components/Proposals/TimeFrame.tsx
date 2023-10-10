import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ProposalState } from 'state/types'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

interface TimeFrameProps {
  startDate: number
  endDate: number
  proposalState: ProposalState
}

const getFormattedDate = (timestamp: number) => {
  return dayjs.unix(timestamp).format('MMM Do, YYYY HH:mm')
}

const TimeFrame: React.FC<React.PropsWithChildren<TimeFrameProps>> = ({ startDate, endDate, proposalState }) => {
  const { t } = useTranslation()
  const textProps = {
    fontSize: '16px',
    color: 'textSubtle',
    ml: '8px',
  }

  if (proposalState === ProposalState.CLOSED) {
    return <Text {...textProps}>{t('Ended %date%', { date: getFormattedDate(endDate) })}</Text>
  }

  if (proposalState === ProposalState.PENDING) {
    return <Text {...textProps}>{t('Starts %date%', { date: getFormattedDate(startDate) })}</Text>
  }

  return <Text {...textProps}>{t('Ends %date%', { date: getFormattedDate(endDate) })}</Text>
}

export default TimeFrame
