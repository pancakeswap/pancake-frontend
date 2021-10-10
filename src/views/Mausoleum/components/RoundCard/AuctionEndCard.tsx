import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  CardBody,
  PlayCircleOutlineIcon,
  Button,
  Text, Flex, FlexProps,
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BetPosition } from 'state/types'
import CardFlip from '../CardFlip'
import { RoundResultBox } from '../RoundResult'
import Card from './Card'
import CardHeader from './CardHeader'
import SetPositionCard from './SetPositionCard'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { getBalanceAmount } from '../../../../utils/formatBalance'
import { account, auctionById, auctions } from '../../../../redux/get'
import { getMausoleumAddress } from '../../../../utils/addressHelpers'
import { useERC20, useMausoleum, useMultiCall } from '../../../../hooks/useContract'
import '../MobileCard/cardStyles.css'

// PrizePoolRow
interface CurrentBidProps extends FlexProps {
  totalAmount: BigNumber,
  v3: boolean,
}


export const CurrentBid: React.FC<CurrentBidProps> = ({ totalAmount, v3, ...props }) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems='center' justifyContent='space-between' {...props}>
      <Text bold>{t('Final Bid')}:</Text>
      <Text bold>{getBalanceAmount(totalAmount).toString()} {v3 ? 'BNB' : 'BT'}</Text>
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

const AuctionEndCard: React.FC<OpenRoundCardProps> = ({ lastBid, refresh, setRefresh, id, bidId }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { isSettingPosition, position } = state
  const { aid, version, bidToken, prize, auctionInfo: { finalized }, userInfo: { bid } } = auctionById(id)
  const mausoleum = useMausoleum(version)
  const bidTokenContract = useERC20(bidToken)
  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const togglePosition = () => {
    setState((prevState) => ({
      ...prevState,
      position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
    }))
  }

  const [allowance, setAllowance] = useState(BIG_ZERO)
  const [amount, setAmount] = useState(lastBid.amount ? new BigNumber(lastBid.amount) : BIG_ZERO)

  if (!amount.eq(bid) && amount.eq(BIG_ZERO)) {
    setAmount(new BigNumber(bid))
  }

  const v3 = version === 'v3'

  const withdrawBid = () => {
    if (account()) {
      mausoleum.methods.withdrawBid(aid)
        .send({ from: account() })
    }
  }


  const accountAddress = account()

  useEffect(() => {
    if (accountAddress && !v3) {
      bidTokenContract.methods.allowance(accountAddress, getMausoleumAddress(version)).call()
        .then(res => {
          setAllowance(new BigNumber(res))
        })
    }
  }, [accountAddress, bidTokenContract.methods, v3, version])

  return (
    <CardFlip isFlipped={isSettingPosition} height='404px'>
      <Card className='mbCardStyle'>
        <CardHeader
          status='next'
          icon={<PlayCircleOutlineIcon color='white' mr='4px' width='21px' />}
          title={t('Bid')}
          bid={lastBid}
          id={bidId}
        />
        <CardBody p='16px'>
          <RoundResultBox>
            <>
              <CurrentBid totalAmount={amount} v3={v3} mb='8px' />
              <Flex alignItems='center' justifyContent='center'>
                <Button
                  variant='secondary'
                  disabled
                  onClick={withdrawBid}
                  style={{
                    width: '75%',
                    justifyContent: 'center',
                  }}
                >
                  {t('CLOSED')}
                </Button>
              </Flex>
              <br/>
              <Flex alignItems='center' justifyContent='center' >
                { finalized ? `${prize} NFT has been rewarded.` : 'NFT will be rewarded shortly.'}
              </Flex>
              <br/>
              <Flex alignItems='center' justifyContent='center'>
                {!bid.isZero() ? <Button
                  variant='primary'
                  onClick={withdrawBid}
                  style={{
                    width: '75%',
                    justifyContent: 'center',
                  }}
                >
                  {t('WITHDRAW BID')}
                </Button> : null}
              </Flex>
              </>
          </RoundResultBox>
        </CardBody>
      </Card>
      <SetPositionCard
        id={id}
        onBack={handleBack}
        onSuccess={async () => {
          console.log('success')
        }}
        position={position}
        togglePosition={togglePosition}
      />
    </CardFlip>
  )
}

export default AuctionEndCard
