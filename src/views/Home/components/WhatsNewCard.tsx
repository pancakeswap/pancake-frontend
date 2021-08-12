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
            <Text fontSize='14px'>1. Apeswap migration starts today, check out tombs.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>2. Euler Tools Spawning Pool is live!</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>3. Thunderswap grave is out now! Multiplier graves are on the way, you will deposit your RugZombie Common NFTs to gain access.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>4. First auction was a huge success, thanks for participating & congrats to the winner.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>5. Send a message in our telegram if you find bugs, might even send you some zmbe if theyre good ones ;).</Text>
          </Row>
        </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
