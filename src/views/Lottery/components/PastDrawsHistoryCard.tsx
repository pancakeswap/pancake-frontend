import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const PastDrawsHistoryCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <span>History</span>
      </CardBody>
    </Card>
  )
}

export default PastDrawsHistoryCard
