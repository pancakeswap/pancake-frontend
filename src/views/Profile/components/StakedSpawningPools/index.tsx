import React from 'react'
import { BaseLayout, Flex } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { tombByPid } from 'redux/get'
import { useDrFrankenstein } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'

const TableCards = styled(BaseLayout)`
  width: 80%;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`
const StakedSpawningPools: React.FC<{ zombieStaked }> = ({ zombieStaked }) => {
  const handleHarvest = () => {
    console.log('harvest')
  }
  return (
    <TableCards>
      <div className='frank-card'>
          <div className='small-text'>
            <span className='green-color'>Zombie </span>
            <span className='white-color'>STAKED</span>
          </div>
          <div className='space-between'>
            <div className='frank-earned'>
              <span className='text-shadow'>{getFullDisplayBalance(zombieStaked, 18, 4)}</span>
            </div>
            <button onClick={handleHarvest} className='btn w-auto harvest' type='button'>Harvest All</button>
          </div>
      </div>
    </TableCards>
  )
}

export default StakedSpawningPools