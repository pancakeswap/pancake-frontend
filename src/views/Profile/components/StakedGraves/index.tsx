import { BaseLayout, Flex, useMatchBreakpoints } from '@rug-zombie-libs/uikit'
import React from 'react';
import styled from 'styled-components';
import { useDrFrankenstein } from 'hooks/useContract';
import { getFullDisplayBalance } from 'utils/formatBalance'
import { account, graves } from 'redux/get'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { getId } from '../../../../utils'

const DisplayFlex = styled(BaseLayout)`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  grid-gap: 0px;
}`
const TableCards = styled(BaseLayout)`
  width: 100%;
  & > div {
    grid-column: span 12;
    width: 100%;
  }
`
const StakedGraves:React.FC<{zombieStaked}> = ({zombieStaked}) => {
  const stakedGraves = graves().filter(g => !g.userInfo.amount.isZero())
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const nftsReady = () => {
    let count = 0;
    stakedGraves.forEach((g) => {
      if(Math.floor(Date.now() / 1000) > g.userInfo.nftRevivalDate) {
        count++
      }
    })
    return count
  }
  const zombieEarned = () => {
    let total = BIG_ZERO
    stakedGraves.forEach((g) => {
      total = total.plus(g.userInfo.pendingZombie)
    })
    return total
  }
    const drFrankenstein = useDrFrankenstein();
    const { toastSuccess } = useToast()
    const { t } = useTranslation()
    const handleHarvest = () => {

      stakedGraves.forEach((stakedGrave) => {
        if (getId(stakedGrave.pid) === 0) {
          drFrankenstein.methods.leaveStaking(0)
          .send({from: account()}).then(() => {
            toastSuccess(t('Claimed ZMBE'))
          });
        } else {
          drFrankenstein.methods.withdraw(stakedGrave.pid, 0)
          .send({from: account()}).then(() => {
            toastSuccess(t('Claimed ZMBE'))
          });
        }
      })
      }

  const buttonStyle = isDesktop ? { } : { fontSize: "10px"}
  return (
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
                  <span className='green-color'>Zombie </span>
                  <span className='white-color'>EARNED</span>
                </div>
                <span className="total-earned text-shadow">{getFullDisplayBalance(zombieEarned(), 18, 2)}</span>
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
              <button onClick={handleHarvest}  className={isDesktop ? 'btn w-auto harvest' : 'btn w-100 harvest'} style={buttonStyle} type='button'><span>Harvest All ({stakedGraves.length})</span></button>
            </td>
          </Flex>
        </div>
      </TableCards>
    )
}

export default StakedGraves