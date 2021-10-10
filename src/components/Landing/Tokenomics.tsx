import React from 'react'
import './Landing.Styles.css'
import { useTranslation } from 'contexts/Localization'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { getZombieAddress } from 'utils/addressHelpers'
import { nftTotalSupply } from '../../redux/get'

const Tokenomics = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getZombieAddress()))
  const zmbeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <div id="Tokenomics" className="section-3">
      <h2 className="heading-2">Tokenomics</h2>
      <div className="wrapper">
        <div className="w-layout-grid _3_col_grid">
          <div className="card">
            <h3 className="heading-4">Token Metrics</h3>
            <p className="paragraph-14">Current Supply:  {zmbeSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>
              Burned Supply :  {burnedBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>
              NFTs Minted   :  {nftTotalSupply().toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card">
            <h3 className="heading-4">Details</h3>
            <p className="paragraph-14">Low Block Emission: 10 ZMBE/block<br />
            Unlock + Early Withdraw Fees<br/>
            Automated and Manual Buyback and Burns<br/>
            Whale and Large Liquidity Incentives<br/>
            Long-Term Staking/HODLing Incentives</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokenomics
