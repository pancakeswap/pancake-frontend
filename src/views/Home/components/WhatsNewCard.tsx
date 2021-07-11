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
            <Text fontSize='14px'>Two new graves? Checkout the Graves tab.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>Spawning pools are ready, just awaiting artwork to be completed.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>Auctions will be releasing sooner than we expected.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>App Optimizations (done) - Send a message in our telegram if you find bugs, might even send you some zmbe if theyre good ones ;).</Text>
          </Row>
        </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
