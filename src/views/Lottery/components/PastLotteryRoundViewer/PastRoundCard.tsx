import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`

const PastRoundCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <CardHeading>
          <span>Round</span>
        </CardHeading>
      </CardBody>
      <CardFooter>
        <span>Grid</span>
      </CardFooter>
    </Card>
  )
}

export default PastRoundCard
