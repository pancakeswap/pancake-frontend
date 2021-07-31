import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import numeral from 'numeral'
import { getBalanceAmount } from '../../../utils/formatBalance'
import { bnbPriceUsd, drFrankensteinZombieBalance, zmbeBnbTomb, zombiePriceUsd } from '../../../redux/get'
import store from '../../../redux/store'
import tombs from '../../../redux/tombs'
import { spawningPool, tomb } from '../../../redux/fetch'
import { useMultiCall, useZombie } from '../../../hooks/useContract'
import * as get from '../../../redux/get'
import { BIG_ZERO } from '../../../utils/bigNumber'

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
  const multi = useMultiCall()
  const zombie = useZombie()
  const [poolInfo, setPoolInfo] = useState(get.spawningPool(0).poolInfo)
  useEffect(() => {
    spawningPool(0, multi, zombie, (data) => {
      if(data.totalZombieStaked) {
        setPoolInfo(data)
      }
    })
  }, [multi, zombie])


  const zombiePrice = zombiePriceUsd()
  const {reserves} = zmbeBnbTomb().result
  const lpTotalSupply = zmbeBnbTomb().result.totalSupply
  const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePrice), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
  const bnbLpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)
  const bnbTombTvl = new BigNumber(zmbeBnbTomb().result.totalStaked).times(bnbLpTokenPrice)
  const zombieBalance = getBalanceAmount(drFrankensteinZombieBalance()).times(zombiePrice)
  const spawningPoolTvl = getBalanceAmount(poolInfo.totalZombieStaked).times(zombiePrice)
  const [tvl, setTvl] = useState(bnbTombTvl.plus(zombieBalance).plus(spawningPoolTvl))
  const newTvl = bnbTombTvl.plus(zombieBalance).plus(spawningPoolTvl)
  useEffect(() => {
    if (!tvl.eq(newTvl) || tvl.isNaN() ) {
      setTvl(newTvl)
    }
  }, [newTvl, tvl])

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
