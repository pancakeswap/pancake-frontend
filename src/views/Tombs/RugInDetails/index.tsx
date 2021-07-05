import { LinkExternal } from '@rug-zombie-libs/uikit'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';

interface RugInDetailsProps {
  details: {
    id: number,
    pid: number,
    name: string,
    withdrawalCooldown: string,
    artist?: any,
    stakingToken: any
  },
  bnbInBusd: number
}

const RugInDetails: React.FC<RugInDetailsProps> = ({
  details: { id, pid, withdrawalCooldown, artist,  }, bnbInBusd,
}) => {

  const drFrankenstein = useDrFrankenstein();

  const [unlockFee, setUnlockFee] = useState(0);

  useEffect(() => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call()
      .then((res) => {
        setUnlockFee(parseFloat(getFullDisplayBalance(new BigNumber(res), tokens.zmbe.decimals, 4)));
      })
  })

  return (
    <div key={id} className="rug-indetails">
      <div className="direction-column">
        <span className="indetails-type">Tomb</span>
        <span className="indetails-title">
          Weight:
          <span className="indetails-value">120X</span>
        </span>
        <span className="indetails-title">
          Zombie TVL:
          <span className="indetails-value">$37.01K</span>
        </span>
        <span className="indetails-title">
          <LinkExternal bold={false} small href={artist}>
            View NFT Artist
        </LinkExternal>
        </span>
      </div>
      <div className="direction-column">
        <span className="indetails-type">Unlock Fees: {unlockFee} BNB
        ({(unlockFee * bnbInBusd).toFixed(2)} in USD)</span>
        <span className="indetails-title">
          Withdrawal Cooldown:
          <span className="indetails-value">{withdrawalCooldown}</span>
        </span>
      </div>
      {/* <div className="direction-column">
          <a href="/" target="_blank" className="indetails-link">Tutorials goes to gitbook</a>
          <a href="/" target="_blank" className="indetails-link">Fees &amp; Tokenomics goes to gitbook page</a>
          <a href="/" target="_blank" className="indetails-link">View Contract goes to BSC Scan (wait for address)</a>
        </div> */}
    </div>
  )
}

export default RugInDetails
