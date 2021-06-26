/* eslint-disable no-nested-ternary */
import { useWeb3React } from '@web3-react/core';
import tokens from 'config/constants/tokens';
import { ethers } from 'ethers';
import React from 'react';
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import { useDrFrankenstein, useERC20 } from '../../../../hooks/useContract';

interface StartFarmingProps {
  paidUnlockFee: boolean,
  isAllowance: boolean,
  pid: number
}

const StartFarming: React.FC<StartFarmingProps> = ({ paidUnlockFee, isAllowance, pid }) => {

  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const { account } = useWeb3React();
  const drFrankenstein = useDrFrankenstein();

  const handleUnlock = () => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call().then((res) => {
      console.log(res.toString())
      drFrankenstein.methods.unlock(pid)
        .send({ from: account, value: res });
    });
  }

  const handleApprove = () => {
    zmbeContract.methods.approve(getDrFrankensteinAddress(), ethers.constants.MaxUint256)
      .send({ from: account });
  }

  const handleModal = () => {
    console.log("stake zombie")
  }

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">START GRAVING</span>
      </div>
      <div className="space-between">
        {!paidUnlockFee ?
          isAllowance ?
            <button onClick={handleUnlock} className="btn btn-disabled w-100" type="button">Unlock Grave</button> :
            <button onClick={handleApprove} className="btn btn-disabled w-100" type="button">Approve ZMBE</button>
          :
          pid === 0 ? <button onClick={handleModal} className="btn btn-disabled w-100" type="button">Stake ZMBE</button> : 
          <button disabled className="btn btn-disabled w-100" type="button">Disabled</button>}
      </div>
    </div>
  )
}

export default StartFarming