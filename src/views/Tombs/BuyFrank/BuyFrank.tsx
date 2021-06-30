import React, { useState } from 'react'
import { useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';
import { format } from 'date-fns';


interface Details {
  id: number,
  name: string,
  withdrawalCooldown: string,
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

const BuyFrank: React.FC<BuyFrankProps> = ({ details: { result: { tokenWithdrawalDate, amount } } }) => {
  const currentDate = Math.floor(Date.now() / 1000);
  const initialWithdrawCooldownTime = parseInt(tokenWithdrawalDate) - currentDate;
  const withdrawCooldownTimeObj = new Date(0);
  withdrawCooldownTimeObj.setSeconds(initialWithdrawCooldownTime); // specify value for SECONDS here
  const displayWithdrawCooldownTime = withdrawCooldownTimeObj.toISOString().substr(11, 8);

  const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  return (


    amount !== "0" ?
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= parseInt(tokenWithdrawalDate) ?
            <span className="total-earned text-shadow">No Withdraw Fees</span> :
            <div>
              <div className="small-text">
                <span className="white-color">5% Withdraw fee is active:</span>
              </div>
              <span className="total-earned text-shadow">
                {displayWithdrawCooldownTime}</span>
            </div>}
        </div>
      </div> :
      <div className="frank-card">
        <div className="small-text">
          <span className="white-color">Buy Zombie</span>
        </div>
        <span className="total-earned text-shadow">
                Pair LP</span>      </div>
  )
}

export default BuyFrank