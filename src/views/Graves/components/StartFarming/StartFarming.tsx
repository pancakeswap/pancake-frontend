/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import { useModal, BaseLayout } from '@rug-zombie-libs/uikit';
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core';
import tokens from 'config/constants/tokens';
import { ethers } from 'ethers';
import { useIfoAllowance } from 'hooks/useAllowance';
import useTokenBalance from 'hooks/useTokenBalance';
import { getFullDisplayBalance } from 'utils/formatBalance'
import React, { useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js'
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import { BIG_ZERO } from 'utils/bigNumber';
import { useDrFrankenstein, useERC20 } from '../../../../hooks/useContract';
import StakeModal from '../StakeModal';
import StakeZombieModal from '../StakeZombieModal';
import WithdrawZombieModal from '../WithdrawZombieModal';
import useAuth from '../../../../hooks/useAuth'
import { getZombieContract } from '../../../../utils/contractHelpers'
import { zombieAllowance } from '../../../../redux/get'


const DisplayFlex = styled(BaseLayout)`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  grid-gap: 0px;
}`


interface Result {
  paidUnlockFee: boolean,
  rugDeposited: number,
  tokenWithdrawalDate: any,
  amount: BigNumber,
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
    result: Result,
    poolInfo: any,
    userInfo: any,
    pcsVersion: string,
  },
  isAllowance: boolean,
  updateAllowance: any,
  updateResult: any,
  zombieUsdPrice: number,
}

const StartFarming: React.FC<StartFarmingProps> = ({ details, details: { pid, rug, result: { paidUnlockFee, rugDeposited }, poolInfo, userInfo }, zombieUsdPrice, isAllowance, updateAllowance, updateResult }) => {
  const [isAllowanceForRugToken, setIsAllowanceForRugToken] = useState(false);

  const [rugTokenAmount, setRugTokenAmount] = useState(0);

  const [zombieBalance, setZombieBalance] = useState(BIG_ZERO);

  const [onPresentStake] = useModal(
    <StakeModal
      details={details}
      updateResult={updateResult}
      updateAllowance={updateAllowance}
    />,
  );

  const [onPresentZombieStake] = useModal(
    <StakeZombieModal
      details={details}
      zombieBalance={zombieBalance}
      zombieUsdPrice={zombieUsdPrice}
      poolInfo={poolInfo}
      updateResult={updateResult}
    />,
  )

  const [onPresentWithdrawStake] = useModal(
    <WithdrawZombieModal
      details={details}
      zombieBalance={zombieBalance}
      zombieUsdPrice={zombieUsdPrice}
      poolInfo={poolInfo}
      userInfo={userInfo}
      updateResult={updateResult}
    />
  )


  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const { account } = useWeb3React();
  const drFrankenstein = useDrFrankenstein();

  let allowance;
  let rugContract;

  if (pid !== 0) {
    rugContract = useERC20(getAddress(rug.address));
    allowance = useIfoAllowance(rugContract, getDrFrankensteinAddress());
  }

  const zmbeBalance = useTokenBalance(getAddress(tokens.zmbe.address))

  useEffect(() => {
    if (pid !== 0) {
      if (parseInt(allowance.toString()) !== 0) {
        setIsAllowanceForRugToken(true);
      }
    }
    setZombieBalance(zmbeBalance);
  }, [allowance, drFrankenstein.methods, pid, rug.address, zmbeBalance])

  const handleUnlock = () => {
    drFrankenstein.methods.unlockFeeInBnb(pid).call().then((res) => {
      drFrankenstein.methods.unlock(pid)
        .send({ from: account, value: res }).then(() => {
          updateResult(pid);
        })
    });
  }

  const handleApprove = () => {
    // if(account) {
      zmbeContract.methods.approve(getDrFrankensteinAddress(), ethers.constants.MaxUint256)
        .send({ from: account }).then((res) => {
        updateAllowance(zmbeContract, pid);
      })
    // }
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
      .send({ from: account }).then((res) => {
        if (parseInt(res.toString()) !== 0) {
          setIsAllowanceForRugToken(true);
        } else {
          setIsAllowanceForRugToken(false);
        }
      })
  }
  const renderButtonsForGrave = () => {
    return <div className="space-between">
      {account ?
        !paidUnlockFee ?
        zombieAllowance().gt(0) ?
          <button onClick={handleUnlock} className="btn btn-disabled w-100" type="button">Unlock Grave</button> :
          <button onClick={handleApprove} className="btn btn-disabled w-100" type="button">Approve ZMBE</button>
        :
        <div>
          <DisplayFlex>
            <span style={{ paddingRight: '50px' }} className="total-earned text-shadow">{getFullDisplayBalance(new BigNumber(userInfo.amount), tokens.zmbe.decimals, 4)}</span>
            <button onClick={onPresentWithdrawStake} style={{ marginRight: '10px' }} className="btn w-100" type="button">-</button>
            <button onClick={onPresentZombieStake} className="btn w-100" type="button">+</button>
          </DisplayFlex>
        </div>
        :  <span className="total-earned text-shadow">Connect Wallet</span>}
    </div>
  }

  const renderButtonsForTraditionalGraves = () => {
    return <div className="space-between">
      {account ?
        isAllowanceForRugToken ?
        rugDeposited.toString() === '0' ?
          <button onClick={onPresentStake} className="btn btn-disabled w-100" type="button">Deposit {rug.symbol}</button> :
          renderButtonsForGrave()
        : <button onClick={handleApproveRug} className="btn btn-disabled w-100" type="button">Approve {rug.symbol}</button>
      :  <span className="total-earned text-shadow">Connect Wallet</span>}</div>
  }

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">STAKING</span>
      </div>
      {pid === 0 ? renderButtonsForGrave() : renderButtonsForTraditionalGraves()}
    </div>
  )
}

export default StartFarming