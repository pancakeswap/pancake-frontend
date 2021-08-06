import React, { useState } from 'react'
import { Button, useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';
import { formatDuration } from '../../../utils/timerHelpers'
import { tombByPid } from '../../../redux/get'
import { APESWAP_ADD_LIQUIDITY_URL, BASE_ADD_LIQUIDITY_URL } from '../../../config'
import { getAddress } from '../../../utils/addressHelpers'


interface Details {
  id: number,
  name: string,
  withdrawalCooldown: string,
  artist?: any,
  stakingToken: any,
  pid: number,
  result: any,
  poolInfo: any,
  pendingZombie: any
}

interface BuyFrankProps {
  details: Details
}

const BuyFrank: React.FC<BuyFrankProps> = ({ details: { pid, result: { tokenWithdrawalDate } } }) => {
  const currentDate = Math.floor(Date.now() / 1000);
  const initialWithdrawCooldownTime = parseInt(tokenWithdrawalDate) - currentDate;
  const tomb = tombByPid(pid)
  const { amount } = tomb.userInfo
  const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  const addLiquidityUrl = `${tomb.exchange === 'Apeswap' ? APESWAP_ADD_LIQUIDITY_URL : BASE_ADD_LIQUIDITY_URL}/${getAddress(tomb.quoteToken.address)}/${getAddress(tomb.token.address)}`
  console.log(amount)
  return (
    !amount.isZero() ?
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= parseInt(tokenWithdrawalDate) ?
            <span className="total-earned text-shadow">No Withdraw Fees</span> :
            <div>
              <div className="small-text">
                <span className="white-color">5% Withdraw fee is active:</span>
              </div>
              <span className="total-earned text-shadow">
                {formatDuration(initialWithdrawCooldownTime)}</span>
            </div>}
        </div>
      </div> :
      <div className='frank-card'>
        <div className='small-text'>
          <span className='white-color'>Supply LP</span>
        </div>
        <a href={addLiquidityUrl} target='_blank' rel='noreferrer'>
          <Button className='btn btn-disabled w-100' >Pair LP on {tomb.exchange}</Button>
        </a>
      </div>
  )
}

export default BuyFrank