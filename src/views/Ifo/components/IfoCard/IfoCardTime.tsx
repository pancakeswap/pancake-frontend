import React from 'react'
import styled from 'styled-components'
import { IfoStatus } from 'sushi/lib/types'
import getTimePeriods from 'utils/getTimePeriods'
import useI18n from 'hooks/useI18n'

export interface IfoCardTimeProps {
  isLoading: boolean
  status: IfoStatus
  secondsUntilStart: number
  secondsUntilEnd: number
}

const Details = styled.div`
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: center;
  margin-bottom: 24px;
`

const Countdown = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`

const Label = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  margin-left: 8px;
`

const IfoCardTime: React.FC<IfoCardTimeProps> = ({ isLoading, status, secondsUntilStart, secondsUntilEnd }) => {
  const TranslateString = useI18n()
  const timeUntil = getTimePeriods(status === 'coming_soon' ? secondsUntilStart : secondsUntilEnd)
  const suffix = status === 'coming_soon' ? 'start' : 'finish'

  if (isLoading) {
    return <Details>{TranslateString(999, 'Loading...')}</Details>
  }

  return (
    <Details>
      <Countdown>{`${timeUntil.days}d, ${timeUntil.hours}h, ${timeUntil.minutes}m until ${suffix}`}</Countdown>
      <Label>(blocks)</Label>
    </Details>
  )
}

export default IfoCardTime
