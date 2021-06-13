import React from 'react'


const RugInDetails: React.FC = () => {
  return (
    <div className="rug-indetails">
        <div className="direction-column">
          <span className="indetails-type">Yearly</span>
          <span className="indetails-title">FRANK APR:
            <span className="indetails-value">693.08%</span>
          </span>
          <span className="indetails-title">Total Returns:
            <span className="indetails-value">693.08%</span>
          </span>
          <span className="indetails-type mt-3">Daily</span>
          <span className="indetails-title">FRANK Daily:
            <span className="indetails-value">1.9%</span>
          </span>
          <span className="indetails-title">Total Returns:
            <span className="indetails-value">1.9%</span>
          </span>
        </div>
        <div className="direction-column">
          <span className="indetails-type">Farm</span>
          <span className="indetails-title">Weight:
            <span className="indetails-value">120X</span>
          </span>
          <span className="indetails-title">FRANK TVL:
            <span className="indetails-value">$37.01K</span>
          </span>
        </div>
        <div className="direction-column">
          <span className="indetails-type">Fees</span>
          <span className="indetails-title">Entrance Fee:
            <span className="indetails-value">0.1%</span>
          </span>
          <span className="indetails-title">Buyback:
            <span className="indetails-value">0.0% (on profits)</span>
          </span>
          <span className="indetails-title">Network Fee:
            <span className="indetails-value">0.0% (on profits)</span>
          </span>
          <span className="indetails-title">Operational Fee:
            <span className="indetails-value">0.0% (on profits)</span>
          </span>
        </div>
        <div className="direction-column">
          <a href="/" target="_blank" className="indetails-link">Tutorials</a>
          <a href="/" target="_blank" className="indetails-link">Fees &amp; Tokenomics</a>
          <a href="/" target="_blank" className="indetails-link">View Contract</a>
        </div>
    </div>
  )
}

export default RugInDetails