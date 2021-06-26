import React from 'react'

interface StartFarmingProps {
  disabled: boolean
}

const StartFarming: React.FC<StartFarmingProps> = ({ disabled }) => {

  const handleClick = () =>{
    console.log("approve zombie");
  }

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">START GRAVING</span>
      </div>
      <div className="space-between">
        <button onClick={handleClick} disabled={disabled} className="btn btn-disabled w-100" type="button">Approve ZMBE</button>
      </div>
    </div>
  )
}

export default StartFarming