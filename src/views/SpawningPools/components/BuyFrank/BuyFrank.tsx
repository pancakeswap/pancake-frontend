import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip';
import { formatDuration } from '../../../../utils/timerHelpers'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { spawningPoolById } from '../../../../redux/get'
// eslint-disable-next-line @typescript-eslint/no-var-requires




interface BuyFrankProps {
  id: number
}

const BuyFrank: React.FC<BuyFrankProps> = ({ id }) => {
  const { userInfo: { tokenWithdrawalDate, nftRevivalDate, amount, paidUnlockFee } } = spawningPoolById(id)
  const currentDate = Math.floor(Date.now() / 1000);
  let nftRevivalDateFixed = nftRevivalDate
  if(nftRevivalDate < 0) {
    nftRevivalDateFixed = currentDate
  }
  let withdrawCooldownTimeFixed = tokenWithdrawalDate
  if(tokenWithdrawalDate < 0) {
    withdrawCooldownTimeFixed = currentDate
  }
  const initialNftTime = nftRevivalDateFixed - currentDate;

  const initialWithdrawCooldownTime = withdrawCooldownTimeFixed - currentDate;
  return (
    // eslint-disable-next-line no-nested-ternary
    paidUnlockFee ?
      amount.eq(BIG_ZERO) ?
        <div className="frank-card">
        <span className="total-earned text-shadow">
                Unlocked
        </span>
        </div> :
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= nftRevivalDate ?
            <span className="total-earned text-shadow" data-tip data-for="nft-minting" data-text-color="black">NFT is Ready
            <ReactTooltip id="nft-minting" place="top" type="light" effect="solid" className="nftTimerPopup">
              Mint your NFT by harvesting or unstaking
            </ReactTooltip>
            </span> :
            <div>
              <div className="small-text">
                <span className="white-color">NFT Timer</span>
              </div>
              <span className="total-earned text-shadow" style={{fontSize: "20px"}}>{formatDuration(initialNftTime)}</span>
            </div>}
          {currentDate >= tokenWithdrawalDate ?
            <span className="total-earned text-shadow">No Withdraw Fees</span> :
            <div>
              <div className="small-text">
                <span className="white-color">5% Withdraw fee is active:</span>
              </div>
              <span className="total-earned text-shadow" style={{fontSize: "20px"}}>
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