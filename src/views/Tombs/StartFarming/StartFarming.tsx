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
import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js'
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import { useERC20 } from '../../../hooks/useContract';
import StakeLpTokenModal from '../StakeLpTokenModal';
import WithdrawLpModal from '../WithdrawLpModal';


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
  amount: BigNumber
}

interface StartFarmingProps {
  details: {
    id: number,
    pid: number,
    name: string,
    withdrawalCooldown: string,
    artist?: any,
    stakingToken: any,
    result: Result,
    poolInfo: any,
    lpAddresses: any,
    quoteToken:any,
    token:any
  },
  isAllowance: boolean,
  updateAllowance: any,
  updateResult: any
}

const StartFarming: React.FC<StartFarmingProps> = ({ details, details: { name, pid, lpAddresses, poolInfo, result }, updateResult, updateAllowance }) => {

  const lpTokenContract = useERC20(getAddress(lpAddresses));
  const { account } = useWeb3React();
  const [isLpTokenAllowance, setIsLpTokenAllowance] = useState(false);
  const lpTokenAllowance = useIfoAllowance(lpTokenContract, getDrFrankensteinAddress());

  const lpTokenBalance = useTokenBalance(getAddress(lpAddresses));

  useEffect(() => {
    if (lpTokenAllowance.toString() !== "0") {
      setIsLpTokenAllowance(true);
    }
  }, [lpTokenAllowance, details]);

  const [onPresentZombieStake] = useModal(
    <StakeLpTokenModal
      details={details}
      updateResult={updateResult}
      lpTokenBalance={lpTokenBalance}
    />,
  )

  const [onPresentWithdrawStake] = useModal(
    <WithdrawLpModal
      details={details}
      updateResult={updateResult}
      lpTokenBalance={lpTokenBalance}
      poolInfo={poolInfo}
    />
  )

  const handleApproveLPToken = () => {
    lpTokenContract.methods.approve(getDrFrankensteinAddress(), ethers.constants.MaxUint256)
      .send({ from: account }).then(() => {
        lpTokenContract.methods.allowance(account, getDrFrankensteinAddress()).call().then((res) => {
          if(res.toString() !== "0") {
            setIsLpTokenAllowance(true);
          } else {
            setIsLpTokenAllowance(false);
          }
        })
      })
  }

  const renderButtonsForGrave = () => {
    return <div className="space-between">
      <DisplayFlex>
        <span style={{ paddingRight: '50px' }} className="total-earned text-shadow">{getFullDisplayBalance(new BigNumber(result.amount), tokens.zmbe.decimals, 4)}</span>
        <button onClick={onPresentWithdrawStake} style={{ marginRight: '10px' }} className="btn w-100" type="button">-</button>
        <button onClick={onPresentZombieStake} className="btn w-100" type="button">+</button>
      </DisplayFlex>
    </div>
  }

  const renderButtonsForTraditionalGraves = () => {
    return <div className="space-between">
      {isLpTokenAllowance ?
        renderButtonsForGrave()
        : <button onClick={handleApproveLPToken} className="btn btn-disabled w-100" type="button">Approve {name} LP</button>}</div>
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