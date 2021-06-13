import React from 'react'


const FrankEarned: React.FC = () => {
  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="green-color">Frank </span>
        <span className="white-color">EARNED</span>
      </div>
      <div className="space-between">
        <div className="frank-earned">
          <span className="text-shadow">0.000000</span>
        </div>
        <button className="btn btn-disabled w-auto harvest" type="button">Harvest</button>
      </div>
    </div>
  )
}

export default FrankEarned