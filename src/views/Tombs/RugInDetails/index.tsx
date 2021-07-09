import { LinkExternal } from '@rug-zombie-libs/uikit'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import numeral from 'numeral'
import { BIG_ZERO } from '../../../utils/bigNumber'

interface RugInDetailsProps {
  details: {
    id: number,
    pid: number,
    name: string,
    withdrawalCooldown: string,
    artist?: any,
    stakingToken: any,
    poolInfo: any
  },
  bnbInBusd: number,
  totalLpTokensStaked: BigNumber,
  lpTokenPrice: BigNumber,
  tvl: BigNumber
}

const RugInDetails: React.FC<RugInDetailsProps> = ({
  details: { id, name, pid, withdrawalCooldown, artist, poolInfo }, tvl, totalLpTokensStaked, lpTokenPrice,
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

  console.log("tvl")
  console.log(tvl.toString())
  return (
    <div key={id} className="rug-indetails">
      <div className="direction-column">
        <span className="indetails-type">{name} Tomb</span>
        <span className="indetails-title">
          Weight:
          <span className="indetails-value">{allocPoint.div(100).toString()}X</span>
        </span>
        <span className="indetails-title">
          Tomb TVL:
          <span className="indetails-value">{numeral(tvl).format('($ 0.00 a)')}</span>
        </span>
      </div>
      <div className="direction-column">
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
