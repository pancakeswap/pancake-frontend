import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { toDate, format } from 'date-fns'
import { useTranslation } from 'contexts/Localization'
import { ProposalState } from '../../types'

interface TimeFrameProps {
  startDate: number
  endDate: number
  proposalState: ProposalState
}

const getFormattedDate = (timestamp: number) => {
  const date = toDate(timestamp * 1000)
  return format(date, 'MMM do, yyyy HH:mm')
}

const TimeFrame: React.FC<TimeFrameProps> = ({ startDate, endDate, proposalState }) => {
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
