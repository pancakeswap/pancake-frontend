import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import numeral from 'numeral'
import { getBalanceAmount } from '../../../utils/formatBalance'
import { bnbPriceUsd, drFrankensteinZombieBalance, zmbeBnbTomb, zombiePriceUsd } from '../../../redux/get'
import store from '../../../redux/store'
import tombs from '../../../redux/tombs'
import { tomb } from '../../../redux/fetch'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`
const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TotalValueLockedCard: React.FC = () => {

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size='lg' mb='24px'>
          Dev Notes
        </Heading>
        <>
          <Row>
            <Text fontSize='14px'>1. New Burger Swap & Rugbiden Graves? Checkout the Graves tab.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>2. Auctions and Spawning Pools delayed. The team decided to spend time polishing these features instead releasing them over the past weekend.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>3. Releasing referral program along with some bigger news (1-2 weeks).</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>4. Send a message in our telegram if you find bugs, might even send you some zmbe if theyre good ones ;).</Text>
          </Row>
        </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
