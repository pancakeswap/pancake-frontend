import React, { useState } from 'react'
import { useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';
import { format } from 'date-fns';


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

const BuyFrank: React.FC<BuyFrankProps> = ({ details: { result: { tokenWithdrawalDate, nftRevivalDate, amount } }, details }) => {

  const currentDate = Math.floor(Date.now() / 1000);
  const [nftTimer, setNftTimer] = useState(parseInt(nftRevivalDate) - currentDate);
  const [tokenTimer, setTokenTimer] = useState(parseInt(tokenWithdrawalDate) - currentDate);

  const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  return (


    amount !== "0" ?
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= parseInt(nftRevivalDate) ?
            <span className="total-earned text-shadow">NFT is Ready</span> :
            <div>
              <div className="small-text">
                <span className="white-color">NFT Timer</span>
              </div>
              <span className="total-earned text-shadow">{format(nftTimer, 'HH:mm:ss')}</span>
            </div>}
          {currentDate >= parseInt(tokenWithdrawalDate) ?
            <span className="total-earned text-shadow">No Withdraw Fees</span> :
            <div>
              <div className="small-text">
                <span className="white-color">5% Withdraw fee is active:</span>
              </div>
              <span className="total-earned text-shadow">
                {format(tokenTimer, 'HH:mm:ss')}</span>
            </div>}
        </div>
      </div> :
      <div className="frank-card">
        <div className="small-text">
          <span className="white-color">Buy Zombie</span>
        </div>
        <button onKeyDown={onPresent1} onClick={onPresent1} className="btn w-100" type="button">Buy with BNB</button>
      </div>
  )
}

export default BuyFrank