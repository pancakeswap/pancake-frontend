import React from 'react'
import { BaseLayout } from '@rug-zombie-libs/uikit';
import styled from 'styled-components';
import tokens from 'config/constants/tokens';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { tombByPid } from 'redux/get';
import { useDrFrankenstein } from 'hooks/useContract';
import { useWeb3React } from '@web3-react/core';

const TableCards = styled(BaseLayout)`
  width: 80%;
  & > div {
    grid-column: span 12;
    width: 100%;
  }
`
const StakedTombs:React.FC<{stakedTombs}> = ({stakedTombs}) => {
    const drFrankenstein = useDrFrankenstein()
    const account = useWeb3React()
    const zmbeEarned = () => {
        let total = 0;
        stakedTombs.forEach((stakedTomb) => {
            const tomb = tombByPid(stakedTomb.pid)
            const { pendingZombie } = tomb.userInfo
            total += parseFloat(getFullDisplayBalance(pendingZombie, tokens.zmbe.decimals, 4))
            
        })
        return total
    }
    const handleHarvest = () => {
        stakedTombs.forEach((stakedTomb) => {
            if (stakedTomb.pid === 0) {
                drFrankenstein.methods.leaveStaking(0)
                .send({from: account});
              } else {
                drFrankenstein.methods.withdraw(stakedTomb.pid, 0)
                .send({from: account});
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

export default StakedTombs