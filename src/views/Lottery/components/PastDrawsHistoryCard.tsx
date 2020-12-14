import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const PastDrawsHistoryCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <Heading size="md">History</Heading>
      </CardBody>
    </Card>
  )
}

export default PastDrawsHistoryCard
