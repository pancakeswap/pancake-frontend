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
import { tombByPid } from '../../../redux/get'


const DisplayFlex = styled(BaseLayout)`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  grid-gap: 0px;
}`


interface StartFarmingProps {
  pid: number,
  isAllowance: boolean,
  updateAllowance: any,
  updateResult: any,
}

const StartFarming: React.FC<StartFarmingProps> = ({pid, updateResult }) => {
  const { account } = useWeb3React();
  const [isLpTokenAllowance, setIsLpTokenAllowance] = useState(false);
  const tomb = tombByPid(pid)
  const { name, lpAddress, userInfo: { lpAllowance, amount } } = tomb
  console.log()
  const lpTokenBalance = useTokenBalance(getAddress(lpAddress));
  const lpTokenContract = useERC20(getAddress(lpAddress))
  useEffect(() => {
    if (!lpAllowance.isZero()) {
      setIsLpTokenAllowance(true);
    }
  }, [lpAllowance]);

  const [onPresentZombieStake] = useModal(
    <StakeLpTokenModal
      pid={pid}
      lpAddress={getAddress(lpAddress)}
      updateResult={updateResult}
      lpTokenBalance={lpTokenBalance}
    />,
  )

  const [onPresentWithdrawStake] = useModal(
    <WithdrawLpModal
      pid={pid}
      updateResult={updateResult}
      lpTokenBalance={lpTokenBalance}
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
        <span style={{ paddingRight: '50px' }} className="total-earned text-shadow">{getFullDisplayBalance(amount, tokens.zmbe.decimals, 4)}</span>
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
      {renderButtonsForTraditionalGraves()}
    </div>
  )
}

export default StartFarming