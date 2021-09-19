import React, { useEffect, useState } from 'react'
import { BaseLayout, Flex } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import {
  account,
  bnbPriceUsd,
  tombs,
  zmbeBnbTomb,
  zombiePriceUsd,
} from 'redux/get'
import { useDrFrankenstein, useMultiCall } from 'hooks/useContract'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { initialTombData } from '../../../../redux/fetch'

const TableCards = styled(BaseLayout)`
  width: 100%;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const DisplayFlex = styled(BaseLayout)`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  grid-gap: 0px;
}`

const StakedTombs: React.FC = () => {
  const drFrankenstein = useDrFrankenstein()
  const stakedTombs = tombs().filter(t => !t.userInfo.amount.isZero())
  const [updateTombUserInfo, setUpdateTombUserInfo] = useState(0)
  const [updateTombPoolInfo, setUpdateTombPoolInfo] = useState(0)
  const multi = useMultiCall()
  const { poolInfo: { totalStaked, reserves, lpTotalSupply } } = zmbeBnbTomb()

  const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePriceUsd()), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
  const lpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)

  const lpStaked = () => {
    let total = BIG_ZERO
    stakedTombs.forEach(t => {
      total = total.plus(t.userInfo.amount)
    })
    return total
  }

  const zombieEarned = () => {
    let total = BIG_ZERO
    stakedTombs.forEach(t => {
      total = total.plus(t.userInfo.pendingZombie)
    })
    return total
  }

  const handleHarvest = () => {
    stakedTombs.forEach((t) => {
      drFrankenstein.methods.withdraw(t.pid, 0)
        .send({ from: account() })
    })
  }

  useEffect(() => {
    if(updateTombUserInfo === 0) {
      initialTombData(
        multi,
        { update: updateTombPoolInfo, setUpdate: setUpdateTombPoolInfo },
        { update: updateTombUserInfo, setUpdate: setUpdateTombUserInfo },
      )
    }
  }, [drFrankenstein.methods, multi, updateTombPoolInfo, updateTombUserInfo])

  return (
    <TableCards>
      <div className='frank-card'>
        <Flex justifyContent='center'>
          <td className='td-width-25'>
            <DisplayFlex>
              <div className='small-text'>
                <span className='green-color'>LPs </span>
                <span className='white-color'>STAKED</span>
              </div>
              <span className='total-earned'>{getFullDisplayBalance(lpStaked(), 18, 4)}</span>
            </DisplayFlex>
          </td>
          <td className='td-width-25'>
            <DisplayFlex>
              <div className='small-text'>
                <span className='green-color'>Zombie </span>
                <span className='white-color'>EARNED</span>
              </div>
              <span className='total-earned text-shadow'>{getFullDisplayBalance(zombieEarned(), 18, 4)}</span>
            </DisplayFlex>
          </td>
          <td className='td-width-25'>
            <DisplayFlex>
              <div className='small-text'>
                <span className='green-color'>LP </span>
                <span className='white-color'>PRICE</span>
              </div>
              <span className='total-earned'>${lpTokenPrice.isNaN() ? "0" : getDecimalAmount(lpTokenPrice).toFormat(2).toString()}</span>
            </DisplayFlex>
          </td>
          <td className='td-width-17'>
            <button onClick={handleHarvest} className='btn w-auto harvest' type='button'>Harvest All ({stakedTombs.length})</button>
          </td>
        </Flex>
      </div>
    </TableCards>
  )
}

export default StakedTombs