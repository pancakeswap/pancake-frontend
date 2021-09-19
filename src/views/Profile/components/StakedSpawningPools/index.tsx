import React, { useEffect, useState } from 'react'
import { BaseLayout, Flex } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { grave, graves, spawningPools, tombByPid } from 'redux/get'
import { useDrFrankenstein, useMultiCall } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { initialSpawningPoolData } from '../../../../redux/fetch'

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
const StakedSpawningPools: React.FC<{ zombieStaked }> = ({ zombieStaked }) => {
  const [updateSpawningPoolUserInfo, setUpdateSpawningPoolUserInfo] = useState(false)
  const [updateSpawningPoolPoolInfo, setUpdateSpawningPoolPoolInfo] = useState(false)
  const multi = useMultiCall()

  const handleHarvest = () => {
    console.log('harvest')
  }
  const stakedSpawningPools = spawningPools().filter(sp => !sp.userInfo.amount.isZero())
  const nftsReady = () => {
    let count = 0;
    stakedSpawningPools.forEach((sp) => {
      if(Math.floor(Date.now() / 1000) > sp.userInfo.nftRevivalDate) {
        count++
      }
    })
    return count
  }

  useEffect(() => {
    initialSpawningPoolData(
      multi,
      { update: updateSpawningPoolUserInfo, setUpdate: setUpdateSpawningPoolUserInfo },
      { update: updateSpawningPoolPoolInfo, setUpdate: setUpdateSpawningPoolPoolInfo },
    )
  }, [multi, updateSpawningPoolPoolInfo, updateSpawningPoolUserInfo])

  return (
    <Flex justifyContent='center'>
      <TableCards>
        <div className='frank-card'>
          <Flex justifyContent='center'>
            <td className='td-width-25'>
              <DisplayFlex>
                <div className='small-text'>
                  <span className='green-color'>Zombie </span>
                  <span className='white-color'>STAKED</span>
                </div>
                <span className='total-earned'>{getFullDisplayBalance(zombieStaked, 18, 4)}</span>
              </DisplayFlex>
            </td>
            <td className='td-width-25'>
              <DisplayFlex>
                <div className='small-text'>
                  <span className='green-color'>NFTs </span>
                  <span className='white-color'>READY</span>
                </div>
                <span className='total-earned'>{nftsReady()}</span>
              </DisplayFlex>
            </td>
            <td className='td-width-17'>
              <button onClick={handleHarvest} className='btn w-auto harvest' type='button'>Harvest All ({stakedSpawningPools.length})</button>
            </td>
          </Flex>
        </div>
      </TableCards>
    </Flex>
  )
}

export default StakedSpawningPools