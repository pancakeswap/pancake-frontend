import { LinkExternal } from '@rug-zombie-libs/uikit'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { Token } from '../../../../config/constants/types'
import { BASE_V1_EXCHANGE_URL } from '../../../../config'


interface RugInDetailsProps {
  details: {
    id: number,
    pid: number,
    subtitle: string,
    path: string,
    type: string,
    withdrawalCooldown: string,
    nftRevivalTime: string,
    rug: Token,
    artist?: any,
    stakingToken: any,
    poolInfo: any,
    totalGraveAmount: any,
    pcsVersion: any,
    liquidityDetails: string
  },
  bnbInBusd: number,
  zombieUsdPrice: number
}

const RugInDetails: React.FC<RugInDetailsProps> = ({
  details: { id, subtitle, rug, pcsVersion, liquidityDetails,pid, path, type, withdrawalCooldown, nftRevivalTime, poolInfo, artist, totalGraveAmount }, zombieUsdPrice, bnbInBusd,
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

  let liquidity
  if(pcsVersion === 'v1') {
    liquidity = 'Pancakeswap V1'
  } else if(pcsVersion === 'v2') {
    liquidity = 'Pancakeswap V2'
  } else {
    liquidity = liquidityDetails
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
          Grave TVL:
          <span className="indetails-value">{numeral(getBalanceAmount(totalGraveAmount).times(zombieUsdPrice)).format('($ 0.00 a)')}</span>
        </span>
        <span className="indetails-title">
          <LinkExternal bold={false} small href={artist.twitter}>
            View NFT Artist
        </LinkExternal>
        </span>
        <br/>
        <span className="indetails-type">{rug.symbol}</span>
        <span className="indetails-title">
          Liquidity:
          <span className="indetails-value">{liquidity}</span>
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
