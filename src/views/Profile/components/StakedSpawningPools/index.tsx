import React, { useEffect, useState } from 'react'
import { BaseLayout, Flex, useMatchBreakpoints } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { account, grave, graves, spawningPools, tombByPid } from 'redux/get'
import { useDrFrankenstein, useMultiCall, useSpawningPool, useZombie } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { initialSpawningPoolData } from '../../../../redux/fetch'
import { getSpawningPoolContract } from '../../../../utils/contractHelpers'
import useWeb3 from '../../../../hooks/useWeb3'

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
  const [updateUserInfo, setUpdateUserInfo] = useState(0)
  const web3 = useWeb3()
  const multi = useMultiCall()
  const zombie = useZombie()
  const stakedSpawningPools = spawningPools().filter(sp => !sp.userInfo.amount.isZero())
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const handleHarvest = () => {
    stakedSpawningPools.forEach((sp) => {
      getSpawningPoolContract(sp.id, web3).methods.withdraw(0)
        .send({ from: account()
        })
    })
  }
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
    if(updateUserInfo === 0) {
      initialSpawningPoolData(
        multi,
        zombie,
        undefined,
        { update: updateUserInfo, setUpdate: setUpdateUserInfo },
      )
    }
  }, [multi, updateUserInfo, zombie])

  const buttonStyle = isDesktop ? { } : { fontSize: "10px"}
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
                <span className='total-earned'>{getFullDisplayBalance(zombieStaked, 18, 2)}</span>
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
              <button onClick={handleHarvest}  className={isDesktop ? 'btn w-auto harvest' : 'btn w-100 harvest'} style={buttonStyle} type='button'><span>Harvest All ({stakedSpawningPools.length})</span></button>
            </td>
          </Flex>
        </div>
      </TableCards>
    </Flex>
  )
}

export default StakedSpawningPools