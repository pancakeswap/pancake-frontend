import React from 'react'

interface RugInDetailsProps {
  details: {
    id: number,
    path: string,
    type: string
  }
}
const RugInDetails: React.FC<RugInDetailsProps> = ({ details: { id, path, type } }) => {
  return (
    <div key={id} className="rug-indetails">
      <div className="direction-column imageColumn">
        <div className="sc-iwajpm dcRUtg">
          {type === 'image' ?
            <img src={path} alt="CAKE" className="sc-cxNHIi bjMxQn" /> : 
            <video width="100%" autoPlay>
                <source src={path} type="video/mp4" />
            </video>
          }
        </div>
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
        <span className="indetails-type">Deposit Fees:(dynamic price in BNB equivalent to BUSD 4 dollars)</span>
        <span className="indetails-title">Early Withdrawal:
            <span className="indetails-value">5%</span>
        </span>
        <span className="indetails-title">Withdrawal Cooldown:
            <span className="indetails-value">(timer)</span>
        </span>
        <span className="indetails-title">NFT Mint competion:
            <span className="indetails-value">(timer)</span>
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