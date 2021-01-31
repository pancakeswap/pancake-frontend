import React, { useRef, useCallback, useContext } from 'react'
import { Flex, Text, ArrowForwardIcon, useModal, useWalletModal } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { usePredictionBnb } from 'hooks/useContract'
import { claim } from 'utils/callHelpers'
import { PredictionItem, ActivePredictionItem } from './PredictionItem'
import BidModal from './BidModal'
import { PredictionProviderContext } from '../contexts/PredictionProvider'

const Container = styled.div`
  margin-top: 24px;
  width: calc(100vw - 304px);
  padding-bottom: 16px;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.input};
`
const ScrollContainer = styled.div`
  height: 276px;
  display: flex;
  padding: 16px 0 24px 0;
  scroll-behavior: smooth;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`
const TextButton = styled(Text).attrs({bold: true, color: 'primary'})`
  cursor: pointer;
`
const PredictionList: React.FC = () => {
  const scrollRef = useRef()
  const { connect, reset } = useWallet()
  const bnbPredictionContract = usePredictionBnb()
  const { onPresentConnectModal } = useWalletModal(connect, reset)
  const { preRounds, curRound, nextRound, account, remainSecond, currentEpoch } = useContext(PredictionProviderContext)
  const [onPresent] = useModal(<BidModal account={account} />)
  const onBid = useCallback(() => {
    if (!account) {
      onPresentConnectModal()
      // show connect wallet dialog
    } else {
      onPresent()
    }
  }, [account, onPresent, onPresentConnectModal])
  const handleClaim = useCallback(
    async (epoch) => {
      await claim(bnbPredictionContract, account, epoch)
    },
    [account, bnbPredictionContract],
  )
  const handleScroll = useCallback(left => {
    const step = 200;
    // @ts-ignore
    scrollRef.current.scroll({
      behavior: 'smooth',
      // @ts-ignore
      left: scrollRef.current.scrollLeft + (left ? -step : step),
    })
  }, [])

  return (
    <Container>
      <ScrollContainer ref={scrollRef}>
        <Flex>
          {preRounds.map((item) => (
            <PredictionItem key={item.epoch} handleClaim={handleClaim} {...item} />
          ))}
          {curRound.epoch !== undefined && (
            <ActivePredictionItem {...curRound} remainSecond={remainSecond} currentEpoch={currentEpoch} />
          )}
          {nextRound.epoch !== undefined && <PredictionItem {...nextRound} remainSecond={remainSecond} onBid={onBid} />}
        </Flex>
      </ScrollContainer>
      <Flex px="20px" justifyContent="space-between">
        <TextButton onClick={() => handleScroll(true)}>
          <ArrowForwardIcon
            width="24px"
            mr="1"
            color="primary"
            style={{ transform: 'rotate(180deg)', verticalAlign: '-7px' }}
          />
          Back
        </TextButton>
        <TextButton onClick={() => handleScroll(false)}>
          More
          <ArrowForwardIcon width="24px" ml="1" color="primary" style={{ verticalAlign: '-7px' }} />
        </TextButton>
      </Flex>
    </Container>
  )
}

export default PredictionList
