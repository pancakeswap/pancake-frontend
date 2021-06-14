import React from 'react'
import './Landing.Styles.css'

const Tokenomics = () => {
  return (
    <div id="Tokenomics" className="section-3">
      <h2 className="heading-2">Tokenomics</h2>
      <div className="wrapper">
        <div className="w-layout-grid _3_col_grid">
          <div className="card">
            <h3 className="heading-4">Original Supply</h3>
            <p className="paragraph-14">100,000,000 <br />Emission: 20 ZMBE per block </p>
          </div>
          <div className="card">
            <h3 className="heading-4">Manual + Automated Buy-Back and Burns </h3>
            <p className="paragraph-14">Low Block Emission <br />Unlock + Withdraw Fees  </p>
            {/* <p className="paragraph-16">2% of total supply wallet balance limit for first 10 minutes after launch</p> */}
          </div>
          <div className="card">
            <h3 className="heading-4">Whale and Large Liquidity Incentives </h3>
            <p className="paragraph-15">Long-Term Staking/HODLing Incentives </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokenomics
