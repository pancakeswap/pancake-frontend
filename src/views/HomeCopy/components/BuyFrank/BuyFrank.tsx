import React from 'react'
import { useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';


const BuyFrank: React.FC = () => {
const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">Buy Zombie</span>
      </div>
      <div className="space-between">
        <button  onKeyDown={onPresent1} onClick={onPresent1}  className="btn w-100" type="button">Buy with FTM</button>
      </div>
    </div>
  )
}

export default BuyFrank