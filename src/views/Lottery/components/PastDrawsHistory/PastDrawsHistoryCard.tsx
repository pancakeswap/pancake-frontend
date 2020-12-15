import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import HistoryChart from './HistoryChart'

const PastDrawsHistoryCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <Heading size="md">{TranslateString(999, 'History')}</Heading>

        <HistoryChart />
      </CardBody>
    </Card>
  )
}

export default PastDrawsHistoryCard
