import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import {
  CardBody,
  LinkExternal,
  PlayCircleOutlineIcon,
  Button,
 Text, Flex, FlexProps,
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BetPosition } from 'state/types'
import CardFlip from '../CardFlip'
import { formatBnb } from '../../helpers'
import { RoundResultBox } from '../RoundResult'
import * as get from '../../../../redux/get'
import Card from './Card'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'
import { getMausoleumContract } from '../../../../utils/contractHelpers'
import useWeb3 from '../../../../hooks/useWeb3'
import { BIG_TEN, BIG_ZERO } from '../../../../utils/bigNumber'
import { getBalanceAmount } from '../../../../utils/formatBalance'

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
  bid: any
}

const IncreaseBidCard: React.FC<OpenRoundCardProps> = ({ bid }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { isSettingPosition, position } = state
  const web3 = useWeb3()


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


  const [amount, setAmount] = useState(new BigNumber(bid.amount))

  const increaseBid = () => {
    setAmount(amount.plus(BIG_TEN.pow(19)))
  }

  const decreaseBid = () => {
    let result = amount.minus(BIG_TEN.pow(19))
    result = result.lt(BIG_ZERO) ? BIG_ZERO : result
    setAmount(result)
  }

  const isDisabled = amount.lt(bid.lastBidAmount) || amount.eq(bid.lastBidAmount)

  const submitBid = () => {
    getMausoleumContract(web3).methods.increaseBid(0, amount)
      .send({from: get.account() })
  }

  return (
    <CardFlip isFlipped={isSettingPosition} height='404px'>
      <Card>
        <CardHeader
          status='next'
          icon={<PlayCircleOutlineIcon color='white' mr='4px' width='21px' />}
          title={t('Bid')}
          bid={bid}
        />
        <CardBody p='16px'>
          <RoundResultBox>

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
                <Button
                  variant='secondary'
                  onClick={submitBid}
                  disabled={isDisabled}
                  style={{
                    width: '50%',
                    justifyContent: 'center',
                  }}
                >
                  {t('SUBMIT')}
                </Button>
              </Flex>
              <Flex alignItems='center' justifyContent='center' className='indetails-title' paddingTop='10px'>
                <LinkExternal onClick={() => handleSetPosition(BetPosition.BULL)}
                              fontSize='14px'>{t('Enter custom bid')}</LinkExternal>
              </Flex>
            </>

          </RoundResultBox>
        </CardBody>
      </Card>
      <SetPositionCard
        onBack={handleBack}
        onSuccess={async ()=>{console.log('success')}}
        position={position}
        togglePosition={togglePosition}
      />
    </CardFlip>
  )
}

export default IncreaseBidCard
