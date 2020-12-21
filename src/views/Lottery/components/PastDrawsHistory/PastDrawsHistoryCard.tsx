import React from 'react'
import { Heading, Card, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import HistoryChart from './HistoryChart'
import Legend from './Legend'

interface HistoryProps {
  error: boolean
  historyData: Array<any>
}

const PastDrawsHistoryCard: React.FC<HistoryProps> = ({ error, historyData }) => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <Heading size="md">{TranslateString(999, 'History')}</Heading>
        <Legend />
        <HistoryChart error={error} historyData={historyData} />
      </CardBody>
    </Card>
  )
}

export default PastDrawsHistoryCard
