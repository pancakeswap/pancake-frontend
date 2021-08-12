import React, { useState } from 'react'
import { Button, useModal } from '@rug-zombie-libs/uikit';
import ModalInput from 'components/ModalInput/ModalInput';
import { formatDuration } from '../../../utils/timerHelpers'
import { tombByPid } from '../../../redux/get'
import { APESWAP_ADD_LIQUIDITY_URL, BASE_ADD_LIQUIDITY_URL } from '../../../config'
import { getAddress } from '../../../utils/addressHelpers'
import tokens from '../../../config/constants/tokens'

interface BuyFrankProps {
  pid: number
}

const BuyFrank: React.FC<BuyFrankProps> = ({ pid }) => {
  const currentDate = Math.floor(Date.now() / 1000);
  const tomb = tombByPid(pid)
  const { userInfo: { amount, tokenWithdrawalDate } } = tomb
  const initialWithdrawCooldownTime = tokenWithdrawalDate - currentDate;
  const [onPresent1] = useModal(<ModalInput inputTitle="Stake $ZMBE" />);
  // eslint-disable-next-line no-nested-ternary
  const quoteTokenUrl = tomb.quoteToken === tokens.wbnb ? tomb.exchange === 'Apeswap' ? 'ETH' : 'BNB' : getAddress(tomb.quoteToken.address)
  const addLiquidityUrl = `${tomb.exchange === 'Apeswap' ? APESWAP_ADD_LIQUIDITY_URL : BASE_ADD_LIQUIDITY_URL}/${quoteTokenUrl}/${getAddress(tomb.token.address)}`

  return (
    !amount.isZero() ?
      <div className="frank-card">
        <div className="space-between">
          {currentDate >= tokenWithdrawalDate ?
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