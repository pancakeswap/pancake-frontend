import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import numeral from 'numeral'
import { getBalanceAmount } from '../../../utils/formatBalance'
import {
  bnbPriceUsd,
  drFrankensteinZombieBalance,
  zmbeBnbTomb,
  zombiePriceUsd,
  tombs,
  spawningPools,
} from '../../../redux/get'
import { initialTombData, spawningPool, initialSpawningPoolData, tomb } from '../../../redux/fetch'

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
  const [updatePoolInfo, setUpdatePoolInfo] = useState(0)
  useEffect(() => {
    initialTombData()
  }, [])
  useEffect(() => {
    if(updatePoolInfo === 0) {
      initialSpawningPoolData(zombie, {update: updatePoolInfo, setUpdate: setUpdatePoolInfo})
    }
  }, [multi, updatePoolInfo, zombie])


  const totalSpawningPoolStaked = spawningPools().reduce((accumulator, sp) => {
    return  sp.poolInfo.totalZombieStaked.plus(accumulator)
  }, BIG_ZERO)

  const zombiePrice = zombiePriceUsd()
  let tombsTvl = BIG_ZERO
  tombs().forEach(t => {
    const {poolInfo: { reserves, lpTotalSupply, totalStaked }} = t
    const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePrice), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
    const bnbLpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)
    tombsTvl = tombsTvl.plus(totalStaked.times(bnbLpTokenPrice))
  })

  const zombieBalance = getBalanceAmount(drFrankensteinZombieBalance()).times(zombiePrice)
  const spawningPoolTvl = getBalanceAmount(totalSpawningPoolStaked).times(zombiePrice)
  const [tvl, setTvl] = useState(tombsTvl.plus(zombieBalance).plus(spawningPoolTvl))
  const newTvl = tombsTvl.plus(zombieBalance).plus(spawningPoolTvl)
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
