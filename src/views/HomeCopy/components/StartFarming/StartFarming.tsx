/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import { useModal } from '@rug-zombie-libs/uikit';
import { useWeb3React } from '@web3-react/core';
import tokens from 'config/constants/tokens';
import { ethers } from 'ethers';
import { useIfoAllowance } from 'hooks/useAllowance';
import React, { useEffect, useState } from 'react';
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import { useDrFrankenstein, useERC20 } from '../../../../hooks/useContract';
import StakeModal from '../StakeModal';

interface Result {
  paidUnlockFee: boolean,
  rugDeposited: number
}

interface StartFarmingProps {
  details: {
    id: number,
    pid: number,
    name: string,
    path: string,
    type: string,
    withdrawalCooldown: string,
    nftRevivalTime: string,
    rug: any,
    artist?: any,
    stakingToken: any,
    result: Result
  },
  isAllowance: boolean
}

const StartFarming: React.FC<StartFarmingProps> = ({ details, details: { pid, rug, result: { paidUnlockFee, rugDeposited }, result }, isAllowance }) => {

  const [isAllowanceForRugToken, setIsAllowanceForRugToken] = useState(false);

  const [ rugTokenAmount, setRugTokenAmount ] = useState(0);

  const [onPresentStake] = useModal(
    <StakeModal
    details = {details}
     />,
  )


  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const { account } = useWeb3React();
  const drFrankenstein = useDrFrankenstein();

  let allowance;
  let rugContract;

  if(pid !== 0){
    rugContract = useERC20(getAddress(rug.address));
    allowance = useIfoAllowance(rugContract, getDrFrankensteinAddress());
  }


  useEffect(() => {
    if (pid !== 0) {
      if (parseInt(allowance.toString()) !== 0) {
        setIsAllowanceForRugToken(true);
      }
    }
  }, [allowance, pid, rug.address])

  const handleUnlock = () => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call().then((res) => {
      drFrankenstein.methods.unlock(pid)
        .send({ from: account, value: res });
    });
  }

  const handleApprove = () => {
    zmbeContract.methods.approve(getDrFrankensteinAddress(), ethers.constants.MaxUint256)
      .send({ from: account });
  }


  const handleDepositRug = () => {
    drFrankenstein.methods.depositRug(pid, rugTokenAmount)
    .send({ from: account });
  }

  const handleModal = () => {
    console.log("stake zombie")
    // todo : open modal then on submit call handleDepositRug
    // handleDepositRug()
  }

  

  const handleApproveRug = () => {
    rugContract.methods.approve(getDrFrankensteinAddress(), ethers.constants.MaxUint256)
      .send({ from: account });
  }

  const renderButtonsForGrave = () => {
    return <div className="space-between">
      {!paidUnlockFee ?
        isAllowance ?
          <button onClick={handleUnlock} className="btn btn-disabled w-100" type="button">Unlock Grave</button> :
          <button onClick={handleApprove} className="btn btn-disabled w-100" type="button">Approve ZMBE</button>
        :
        pid === 0 ? <button onClick={onPresentStake} className="btn btn-disabled w-100" type="button">Stake ZMBE</button> :
          <button disabled className="btn btn-disabled w-100" type="button">Disabled</button>}
    </div>
  }

  const renderButtonsForTraditionalGraves = () => {
    return <div className="space-between">
      {isAllowanceForRugToken ?
        rugDeposited.toString() === '0' ?
          <button onClick={onPresentStake} className="btn btn-disabled w-100" type="button">Deposit {rug.symbol}</button> :
          renderButtonsForGrave()
        : <button onClick={handleApproveRug} className="btn btn-disabled w-100" type="button">Approve {rug.symbol}</button>}</div>
  }

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">START GRAVING</span>
      </div>
      {pid === 0 ? renderButtonsForGrave() : renderButtonsForTraditionalGraves()}
    </div>
  )
}

export default StartFarming