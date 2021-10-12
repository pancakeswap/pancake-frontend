/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import { useModal, BaseLayout } from '@rug-zombie-libs/uikit';
import styled from 'styled-components'
import tokens from 'config/constants/tokens';
import { ethers } from 'ethers';
import { useTranslation } from 'contexts/Localization'
import { useIfoAllowance } from 'hooks/useAllowance';
import useTokenBalance from 'hooks/useTokenBalance';
import useToast from 'hooks/useToast'
import { getFullDisplayBalance } from 'utils/formatBalance'
import React, { useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js'
import { getAddress, getDrFrankensteinAddress, getSpawningPoolAddress } from 'utils/addressHelpers'
import { Token } from 'config/constants/types';
import { useDrFrankenstein, useERC20, useMultiCall, useSpawningPool, useZombie } from '../../../../hooks/useContract'
import StakeModal from '../StakeModal';
import StakeZombieModal from '../StakeZombieModal';
import WithdrawZombieModal from '../WithdrawZombieModal';
import * as get from '../../../../redux/get'
import * as fetch from '../../../../redux/fetch'
import useWeb3 from '../../../../hooks/useWeb3'
import { spawningPoolById } from '../../../../redux/get'


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
  id: number,
  isAllowance: boolean,
  updateAllowance: any,
  updateResult: any,
  zombieUsdPrice: number,
}

const StartFarming: React.FC<StartFarmingProps> = ({ id, zombieUsdPrice, updateAllowance, updateResult }) => {
  const zombie = useZombie()
  const multi = useMultiCall()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const pool = spawningPoolById(id)
  const { userInfo } = pool
  const [isZombieAllowance, setZombieAllowance] = useState(!userInfo.zombieAllowance.isZero());
  const [zombieBalance, setZombieBalance] = useState(get.zombieAllowance());
  const [poolInfoUpdate, setPoolInfoUpdate] = useState(0)
  const [userInfoUpdate, setUserInfoUpdate] = useState(0)
  const onUpdate = () => {
    fetch.spawningPool(
      id,
      zombie,
      { update: poolInfoUpdate, setUpdate: setPoolInfoUpdate },
      { update: userInfoUpdate, setUpdate: setUserInfoUpdate },
    )
  }

  const [onPresentStake] = useModal(
    <StakeModal
      pid={id}
      updateResult={onUpdate}
      updateAllowance={updateAllowance}
    />,
  );


  const [onPresentZombieStake] = useModal(
    <StakeZombieModal
      pid={id}
      zombieBalance={zombieBalance}
      zombieUsdPrice={zombieUsdPrice}
      updateResult={onUpdate}
    />,
  )

  const [onPresentWithdrawStake] = useModal(
    <WithdrawZombieModal
      pid={id}
      zombieBalance={zombieBalance}
      zombieUsdPrice={zombieUsdPrice}
      updateResult={onUpdate}
    />
  )

  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const spawningPoolContract = useSpawningPool(id);

  const zmbeBalance = useTokenBalance(getAddress(tokens.zmbe.address))

  useEffect(() => {
    setZombieBalance(zmbeBalance);
  }, [zmbeBalance])

  const handleUnlock = () => {
    spawningPoolContract.methods.unlockFeeInBnb().call().then((res) => {
      spawningPoolContract.methods.unlock()
        .send({ from: get.account(), value: res }).then(() => {
          toastSuccess(t('Pool unlocked'))
          onUpdate();
        })
    });
  }

  const handleApprove = () => {
    if(get.account()) {
    // console.log(getSpawningPoolAddress(id))
      zmbeContract.methods.approve(getSpawningPoolAddress(id), ethers.constants.MaxUint256)
        .send({ from: get.account() }).then(() => {
          toastSuccess(t('Approved ZMBE'))
          setZombieAllowance(true)
      })
    }
  }

  const renderSpawningPoolButtons = () => {
    return <div className="space-between">
      {get.account() ?
        !userInfo.paidUnlockFee ?
          isZombieAllowance ?
          <button onClick={handleUnlock} className="btn btn-disabled w-100" type="button">Unlock Pool</button> :
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

  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">STAKING</span>
      </div>
      {renderSpawningPoolButtons()}
    </div>
  )
}

export default StartFarming