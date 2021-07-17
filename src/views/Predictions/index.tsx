import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMatchBreakpoints, useModal } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'bignumber.js'
import Container from './components/Container'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'
import { getMausoleumContract } from '../../utils/contractHelpers'
import { initialData } from '../../redux/fetch'
import auctions from '../../redux/auctions'

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const [bids, setBids] = useState([])
  const [lastBidId, setLastBidId] = useState(0)
  const [userInfo, setUserInfo] = useState({})
  const { account } = useWeb3React()

  initialData(account)

  const aid = auctions[0].aid

  useEffect(() => {
    if(account) {
      getMausoleumContract().methods.userInfo(aid, account).call()
        .then(userInfoRes => {
          setUserInfo({
            lastBidDate: parseInt(userInfoRes.lastBidDate),
            bid: new BigNumber(userInfoRes.bid),
            paidUnlockFee: userInfoRes.paidUnlockFee
          })
        })
    }
  }, [account, aid])

  // const fetchBids = () => {
  // useEffect(() => {
    getMausoleumContract().methods.bidsLength(aid).call()
      .then(bidsLengthRes => {
        const start = parseInt(bidsLengthRes) - 5 < 0 ? 0 : parseInt(bidsLengthRes) - 5

        for(let x = start; x < parseInt(bidsLengthRes); x++) {
          getMausoleumContract().methods.bidInfo(aid, x).call()
            .then(bidInfoRes => {
              console.log(bidInfoRes)
              bids[x] = {
                id: x,
                amount: bidInfoRes.amount,
                bidder: bidInfoRes.bidder,
                lastBidAmount: bids[x - 1] ? bids[x - 1].amount : 0,
              }
            })
          if(parseInt(bidsLengthRes) === 0 || lastBidId === 0) {
          setBids(bids)
          setLastBidId(parseInt(bidsLengthRes))
          }
        }
      })


  // setInterval(() => fetchBids(), 5000);
  return (
    <>
       <Helmet>
        <script src="https://s3.tradingview.com/tv.js" type="text/javascript" id="tradingViewWidget" />
       </Helmet>
       <SwiperProvider>
        <Container >
           {isDesktop ? <Desktop bids={bids} lastBidId={lastBidId} userInfo={userInfo} aid={aid}/> : <Mobile bids={bids} lastBidId={lastBidId} userInfo={userInfo} aid={aid}/>}
           <CollectWinningsPopup />
         </Container>
       </SwiperProvider>
    </>
  )
}

export default Predictions
