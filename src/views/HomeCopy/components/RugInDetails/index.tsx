import { LinkExternal } from '@rug-zombie-libs/uikit'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber';
import { getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';


interface RugInDetailsProps {
  details: {
    id: number,
    pid: number,
    subtitle: string,
    path: string,
    type: string,
    withdrawalCooldown: string,
    nftRevivalTime: string,
    rug: string,
    artist?: any,
    stakingToken: any,
    poolInfo: any
  },
  bnbInBusd: number,
  totalStakingTokenSupply: BigNumber,
  zombieUsdPrice: number
}

const RugInDetails: React.FC<RugInDetailsProps> = ({
  details: { id, subtitle, pid, path, type, withdrawalCooldown, nftRevivalTime, poolInfo, artist, stakingToken }, totalStakingTokenSupply, zombieUsdPrice, bnbInBusd,
}) => {
  const drFrankenstein = useDrFrankenstein();

  const [unlockFee, setUnlockFee] = useState(0);

  useEffect(() => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call()
      .then((res) => {
        setUnlockFee(parseFloat(getFullDisplayBalance(new BigNumber(res), tokens.zmbe.decimals, 4)));
      })
  })

  let allocPoint = BIG_ZERO;
  if(poolInfo.allocPoint) {
    allocPoint = new BigNumber(poolInfo.allocPoint)
  }

  return (
    <div key={id} className="rug-indetails">
      <div className="direction-column imageColumn">
        <div className="sc-iwajpm dcRUtg">
          {type === 'image' ? (
            <img src={path} alt="CAKE" className="sc-cxNHIi bjMxQn" />
          ) : (
              <video width="100%" autoPlay>
                <source src={path} type="video/mp4" />
              </video>
            )}
        </div>
      </div>
      <div className="direction-column">
        <span className="indetails-type">{subtitle}</span>
        <span className="indetails-title">
          Weight:
          <span className="indetails-value">{allocPoint.div(100).toString()}X</span>
        </span>
        <span className="indetails-title">
          Zombie TVL:
          <span className="indetails-value">{numeral(totalStakingTokenSupply.times(zombieUsdPrice)).format('($ 0.00 a)')}</span>
        </span>
        <span className="indetails-title">
          <LinkExternal bold={false} small href={artist.twitter}>
            View NFT Artist
        </LinkExternal>
        </span>
      </div>
      <div className="direction-column">
        <span className="indetails-type">Unlock Fees: {unlockFee} BNB
        ({(unlockFee * bnbInBusd).toFixed(2)} in USD)</span>
        <span className="indetails-title">
          Early Withdrawal Fee:
          <span className="indetails-value">5%</span>
        </span>
        <span className="indetails-title">
          Withdrawal Cooldown:
          <span className="indetails-value">{withdrawalCooldown}</span>
        </span>
        <span className="indetails-title">
          NFT Minting Time:
          <span className="indetails-value">{nftRevivalTime}</span>
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
