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
            <Text fontSize='14px'>1. We are listed on CoinMarketCap and CoinGecko! Make sure you add RugZombie to your watchlist to get us trending.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>2. Go earn ChompersV2 in the Autoshark Legendary Spawning Pool.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>3. Happy Spawntemberfest. 6 Partnerships, 6 Spawning Pools over 10 days.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>4. Upgraded RugZombie Common grave is out! Please migrate your funds from the legacy grave. You can still remain in the old grave until you earn your NFT.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>5. You can now view your NFTs in the Graveyard.</Text>
          </Row>
          <Row>
            <Text fontSize='14px'>6. Send a message in our telegram if you find bugs, might even send you some zmbe if theyre good ones ;).</Text>
          </Row>
        </>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
