import { LinkExternal } from '@rug-zombie-libs/uikit'
import tokens from 'config/constants/tokens';
import { useDrFrankenstein } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import numeral from 'numeral'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { tombByPid } from '../../../redux/get'
import { getAddress } from '../../../utils/addressHelpers'
import { APESWAP_ADD_LIQUIDITY_URL, BASE_ADD_LIQUIDITY_URL } from '../../../config'

interface RugInDetailsProps {
  pid: number,
  bnbInBusd: number,
  lpTokenPrice: BigNumber,
  tvl: BigNumber
}

const RugInDetails: React.FC<RugInDetailsProps> = ({
  pid, tvl, lpTokenPrice,
}) => {
  const drFrankenstein = useDrFrankenstein();
  const [unlockFee, setUnlockFee] = useState(0);
  const tomb = tombByPid(pid)
  const { id, name, withdrawalCooldown, exchange, poolInfo: { allocPoint } } = tomb
  // eslint-disable-next-line no-nested-ternary
  const quoteTokenUrl = tomb.quoteToken === tokens.wbnb ? tomb.exchange === 'Apeswap' ? 'ETH' : 'BNB' : getAddress(tomb.quoteToken.address)
  const addLiquidityUrl = `${tomb.exchange === 'Apeswap' ? APESWAP_ADD_LIQUIDITY_URL : BASE_ADD_LIQUIDITY_URL}/${quoteTokenUrl}/${getAddress(tomb.token.address)}`
  useEffect(() => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call()
      .then((res) => {
        setUnlockFee(parseFloat(getFullDisplayBalance(new BigNumber(res), tokens.zmbe.decimals, 4)));
      })
  })

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
        <LinkExternal href={addLiquidityUrl} className="indetails-title">
          Pair on {exchange}
        </LinkExternal>
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
