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
  const zombiePrice = zombiePriceUsd()

  const reserves = zmbeBnbTomb().result.reserves
  const lpTotalSupply = zmbeBnbTomb().result.totalSupply
  const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePrice), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
  const bnbLpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)
  const bnbTombTvl = new BigNumber(zmbeBnbTomb().result.totalStaked).times(bnbLpTokenPrice)
  const zombieBalance = getBalanceAmount(drFrankensteinZombieBalance()).times(zombiePrice)

  const [tvl, setTvl] = useState(bnbTombTvl.plus(zombieBalance))

  const newTvl = bnbTombTvl.plus(zombieBalance)
  useEffect(() => {
    if (!tvl.eq(newTvl) || tvl.isNaN() ) {
      setTvl(bnbTombTvl.plus(zombieBalance))
    }
  }, [bnbTombTvl, newTvl, tvl, zombieBalance])

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size='lg' mb='24px'>
          Total Value Locked (TVL)
        </Heading>
        <>
          <Heading size='xl'>{`$${numeral(tvl).format('(0.00 a)')}`}</Heading>
          <Row>

            <Text fontSize='14px'>Across all Tombs and Graves</Text>
          </Row>
        </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
