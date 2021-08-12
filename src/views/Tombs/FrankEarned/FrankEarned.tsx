import React from 'react'
import BigNumber from 'bignumber.js';
import { getFullDisplayBalance } from 'utils/formatBalance'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { tombByPid } from '../../../redux/get'

interface FrankEarnedProps {
  pid: number,
  lpTokenPrice: BigNumber,
}

const FrankEarned: React.FC<FrankEarnedProps> = ({ pid }) => {
  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();
  const tomb = tombByPid(pid)
  const { pendingZombie } = tomb.userInfo
  const pending = typeof pendingZombie === 'string' ? new BigNumber(pendingZombie) : pendingZombie
  const handleHarvest = () => {
    if (pid === 0) {
      drFrankenstein.methods.leaveStaking(0)
      .send({from: account});
    } else {
      drFrankenstein.methods.withdraw(pid, 0)
      .send({from: account});
    }
  }

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="green-color">Zombie </span>
        <span className="white-color">EARNED</span>
      </div>
      <div className="space-between">
        <div className="frank-earned">
          <span className="text-shadow">{getFullDisplayBalance(pending, tokens.zmbe.decimals, 4)}</span>
        </div>
        <button disabled={pending.isZero()} onClick={handleHarvest} className={`btn w-auto harvest ${pending.isZero() ? 'btn-disabled':''}`} type="button">Harvest</button>
      </div>
    </div>
  )
}

export default FrankEarned