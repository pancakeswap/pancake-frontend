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
            <p className="paragraph-14">100,000,000 initial supply<br />10/block emission rate </p>
          </div>
          <div className="card">
            <h3 className="heading-4">Fair launch</h3>
            <p className="paragraph-16">2% of total supply wallet balance limit for first 10 minutes after launch</p>
          </div>
          <div className="card">
            <h3 className="heading-4">Enforcing good whale behaviour</h3>
            <p className="paragraph-15">8% tax when lp providers remove over 5% of lp supply</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokenomics
