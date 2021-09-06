import { BaseLayout } from '@rug-zombie-libs/uikit';
import React from 'react';
import BigNumber from 'bignumber.js';
import tokens from 'config/constants/tokens';
import styled from 'styled-components';
import { useDrFrankenstein } from 'hooks/useContract';
import { getFullDisplayBalance } from 'utils/formatBalance'
import { grave } from 'redux/get';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

const TableCards = styled(BaseLayout)`
  width: 80%;
  & > div {
    grid-column: span 12;
    width: 100%;
  }
`
const StakedGraves:React.FC<{stakedGraves}> = ({stakedGraves}) => {
    const zmbeEarned = () => {
      let total = 0; 
      stakedGraves.forEach((stakedGrave) => {
      const {userInfo:{pendingZombie}} = grave(stakedGrave.pid)
      total += parseFloat(getFullDisplayBalance(new BigNumber(pendingZombie), tokens.zmbe.decimals, 4))
      })
      return total.toString()
    }
    const drFrankenstein = useDrFrankenstein();
    const { toastSuccess } = useToast()
    const { account } = useWeb3React();
    const { t } = useTranslation()
    const handleHarvest = () => {
      stakedGraves.forEach((stakedGrave) => {
        if (stakedGrave.pid === 0) {
          drFrankenstein.methods.leaveStaking(0)
          .send({from: account}).then(() => {
            toastSuccess(t('Claimed ZMBE'))
          });
        } else {
          drFrankenstein.methods.withdraw(stakedGrave.pid, 0)
          .send({from: account}).then(() => {
            toastSuccess(t('Claimed ZMBE'))
          });
        }
      })
      }
    return (
        <TableCards>
        <div className="frank-card">
            <div className="small-text">
                <span className="green-color">Zombie </span>
                <span className="white-color">EARNED</span>
            </div>
            <div className="space-between">
                <div className="frank-earned">
                <span className="text-shadow">{zmbeEarned()}</span>
                </div>
                <button onClick={handleHarvest} className="btn w-auto harvest" type="button">Harvest All</button>
            </div>
        </div>
        </TableCards>
    )
}

export default StakedGraves