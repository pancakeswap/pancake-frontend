import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  CardBody,
  LinkExternal,
  PlayCircleOutlineIcon,
  Button,
 Text, Flex, FlexProps,
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BetPosition } from 'state/types'
import { ethers } from 'ethers'
import CardFlip from '../CardFlip'
import { RoundResultBox } from '../RoundResult'
import Card from './Card'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'
import { BIG_TEN, BIG_ZERO } from '../../../../utils/bigNumber'
import { getBalanceAmount } from '../../../../utils/formatBalance'
import { account, auctionById, auctions } from '../../../../redux/get'
import { getMausoleumAddress } from '../../../../utils/addressHelpers'
import { useERC20, useMausoleum, useMultiCall } from '../../../../hooks/useContract'
import '../MobileCard/cardStyles.css';
import { auction } from '../../../../redux/fetch'

// PrizePoolRow
interface CurrentBidProps extends FlexProps {
  totalAmount: BigNumber,
}


export const CurrentBid: React.FC<CurrentBidProps> = ({ totalAmount, ...props }) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems='center' justifyContent='space-between' {...props}>
      <Text bold>{t('Bid Value')}:</Text>
      <Text bold>{getBalanceAmount(totalAmount).toString()} BT</Text>
    </Flex>
  )
}

interface OpenRoundCardProps {
  lastBid: any
  bidId: number
  id: number
  setRefresh: any
  refresh: boolean
}

const IncreaseBidCard: React.FC<OpenRoundCardProps> = ({ lastBid, refresh, setRefresh, id, bidId }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { isSettingPosition, position } = state
  const { aid, version, bidToken, userInfo: { paidUnlockFee, bid } } = auctionById(id)
  const mausoleum = useMausoleum(version)
  const bidTokenContract = useERC20(bidToken)
  const multi = useMultiCall()
  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const handleSetPosition = (newPosition: BetPosition) => {
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: true,
      position: newPosition,
    }))
  }

  const togglePosition = () => {
    setState((prevState) => ({
      ...prevState,
      position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
    }))
  }

  const [allowance, setAllowance] = useState(BIG_ZERO)
  const [amount, setAmount] = useState(lastBid.amount ? new BigNumber(lastBid.amount) : BIG_ZERO)
  const [update, setUpdate] = useState(false)

  if(!amount.eq(bid) && amount.eq(BIG_ZERO)) {
    setAmount(new BigNumber(bid))
  }

  const increaseBid = () => {
    setAmount(amount.plus(BIG_TEN.pow(19)))
  }

  const decreaseBid = () => {
    let result = amount.minus(BIG_TEN.pow(19))
    result = result.lt(BIG_ZERO) ? BIG_ZERO : result
    setAmount(result)
  }

  const isDisabled = amount.lte(lastBid.amount)

  const submitBid = () => {
    if(account()) {
      mausoleum.methods.increaseBid(aid, amount.minus(bid).toString())
        .send({from: account() })
        .then(()=>{setRefresh(!refresh)})
    }
  }

  const withdrawBid = () => {
    if(account()) {
      mausoleum.methods.withdrawBid(aid)
        .send({from: account()})
    }
  }

  const handleUnlock = () => {
    if(account()) {
      mausoleum.methods.unlockFeeInBnb(aid).call()
        .then(res => {
          mausoleum.methods.unlock(aid)
            .send({from: account(), value: res.toString()})
            .then(() => {
              mausoleum.methods.userInfo(aid, account()).call()
                .then(userInfoRes => {
                  auction(
                    id,
                    multi,
                    undefined,
                    undefined,
                    undefined,
                    {  update, setUpdate }
                  )
                })
            })
        })
    }
  }

  const handleApprove = () => {
    bidTokenContract.methods.approve(getMausoleumAddress(version), ethers.constants.MaxUint256)
      .send({from: account()})
      .then(() => {
        setAllowance(new BigNumber(ethers.constants.MaxUint256.toString()))
      })
  }
  const accountAddress = account()

  useEffect(() => {
    if(accountAddress) {
      bidTokenContract.methods.allowance(accountAddress, getMausoleumAddress(version)).call()
        .then(res => {
          setAllowance(new BigNumber(res))
        })
    }
  }, [accountAddress, bidTokenContract.methods, version])

  return (
    <CardFlip isFlipped={isSettingPosition} height='404px'>
      <Card className="mbCardStyle">
        <CardHeader
          status='next'
          icon={<PlayCircleOutlineIcon color='white' mr='4px' width='21px' />}
          title={t('Bid')}
          bid={lastBid}
          id={bidId}
        />
        <CardBody p='16px'>
          <RoundResultBox>
            {/* eslint-disable-next-line no-nested-ternary */}
            {paidUnlockFee ? allowance.gt(BIG_ZERO) ?
            <>
              <CurrentBid totalAmount={amount} mb='8px' />
              <Button
                variant='success'
                width='100%'
                onClick={increaseBid}
                mb='4px'
              >
                {t('Increase BID')}
              </Button>
              <Button
                variant='danger'
                width='100%'
                onClick={decreaseBid}
                mb='4px'
              >
                {t('Decrease BID')}
              </Button>
              <Flex alignItems='center' justifyContent='center'>
                {/* eslint-disable-next-line no-nested-ternary */}
                { !isDisabled ?
                  <Button
                    variant='secondary'
                    onClick={submitBid}
                    style={{
                      width: '50%',
                      justifyContent: 'center',
                    }}
                  >
                    {t('SUBMIT')}
                  </Button> :
                    lastBid.bidder === account() ?
                      <Button
                        variant='secondary'
                        disabled
                        onClick={withdrawBid}
                        style={{
                          width: '75%',
                          justifyContent: 'center',
                        }}
                      >
                        {t("YOU'RE BID LEADER")}
                      </Button> :
                      <Button
                        variant='secondary'
                        onClick={withdrawBid}
                        style={{
                          width: '50%',
                          justifyContent: 'center',
                        }}
                      >
                        {t('WITHDRAW BID')}
                      </Button>
                }
              </Flex>
              <Flex alignItems='center' justifyContent='center' className='indetails-title' paddingTop='10px'>
                <LinkExternal onClick={() => handleSetPosition(BetPosition.BULL)}
                              fontSize='14px'>{t('Enter custom bid')}</LinkExternal>
              </Flex>
            </> :
              <Flex alignItems='center' justifyContent='center'>
                <Button
                  variant='secondary'
                  onClick={handleApprove}
                  style={{
                    width: '50%',
                    justifyContent: 'center',
                  }}
                >
                  {t('Approve BT')}
                </Button>
              </Flex> :
              <Flex alignItems='center' justifyContent='center'>
                <Button
                  variant='secondary'
                  onClick={handleUnlock}
                  style={{
                    width: '50%',
                    justifyContent: 'center',
                  }}
                >
                  {t('Unlock to start')}
                </Button>
              </Flex>}
          </RoundResultBox>
        </CardBody>
      </Card>
      <SetPositionCard
        id={id}
        onBack={handleBack}
        onSuccess={async ()=>{console.log('success')}}
        position={position}
        togglePosition={togglePosition}
      />
    </CardFlip>
  )
}

export default IncreaseBidCard
