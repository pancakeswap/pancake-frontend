import React, { useState } from 'react'
import { useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';
import { formatDuration } from '../../../../utils/timerHelpers'
// eslint-disable-next-line @typescript-eslint/no-var-requires


interface Details {
  id: number,
  name: string,
  path: string,
  type: string,
  withdrawalCooldown: string,
  nftRevivalTime: string,
  rug: any,
  artist?: any,
  stakingToken: any,
  pid: number,
  result: any,
  poolInfo: any,
  pendingZombie: any
}

interface BuyFrankProps {
  details: Details
}

const BuyFrank: React.FC<BuyFrankProps> = ({ details: { result: { tokenWithdrawalDate, nftRevivalDate, amount, paidUnlockFee } }, details }) => {
  const currentDate = Math.floor(Date.now() / 1000);
  let nftRevivalDateFixed = nftRevivalDate
  if(nftRevivalDate < 0) {
    nftRevivalDateFixed = currentDate
  }
  let withdrawCooldownTimeFixed = tokenWithdrawalDate
  if(tokenWithdrawalDate < 0) {
    withdrawCooldownTimeFixed = currentDate
  }
  const initialNftTime = parseInt(nftRevivalDateFixed) - currentDate;

  const initialWithdrawCooldownTime = parseInt(withdrawCooldownTimeFixed) - currentDate;

  const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  return (
    // eslint-disable-next-line no-nested-ternary
    paidUnlockFee ?
      amount === '0' ?
        <div className="frank-card">
        <span className="total-earned text-shadow">
                Unlocked
        </span>
        </div> :
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= parseInt(nftRevivalDate) ?
            <span className="total-earned text-shadow">NFT is Ready</span> :
            <div>
              <div className="small-text">
                <span className="white-color">NFT Timer</span>
              </div>
              <span className="total-earned text-shadow">{formatDuration(initialNftTime)}</span>
            </div>}
          {currentDate >= parseInt(tokenWithdrawalDate) ?
            <span className="total-earned text-shadow">No Withdraw Fees</span> :
            <div>
              <div className="small-text">
                <span className="white-color">5% Withdraw fee is active:</span>
              </div>
              <span className="total-earned text-shadow">
                {formatDuration(initialWithdrawCooldownTime)}</span>
            </div>}
        </div>
      </div> :
      <div className="frank-card">
        <span className="total-earned text-shadow">
                Locked
        </span>
      </div>
  )
}

export default BuyFrank