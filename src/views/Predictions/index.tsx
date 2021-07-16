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

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const [bids, setBids] = useState([])
  const [lastBidId, setLastBidId] = useState(0)
  const [userInfo, setUserInfo] = useState({})
  const { account } = useWeb3React()

  initialData(account)

  const aid = 0

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
  }, [account])



  getMausoleumContract().methods.bidsLength(aid).call()
    .then(bidsLengthRes => {
      for(let x = 0; x < bidsLengthRes; x++) {
        getMausoleumContract().methods.bidInfo(aid, x).call()
          .then(bidInfoRes => {
            console.log(x > 0 ? bids[x - 1] : "yuh")
            bids[x] = {
              id: x,
              amount: bidInfoRes.amount,
              bidder: bidInfoRes.bidder,
              lastBidAmount: bids[x - 1] ? bids[x - 1].amount : 0,
            }
            bids[bidsLengthRes] = {
              id: parseInt(bidsLengthRes),
              amount: 0,
              bidder: ""
            }
            bids[parseInt(bidsLengthRes) + 1] = {
              id: parseInt(bidsLengthRes) + 1,
              amount: 0,
              bidder: ""
            }
            setBids(bids)
            setLastBidId(parseInt(bidsLengthRes))
          })
      }
    })

  return (
    <>
       <Helmet>
        <script src="https://s3.tradingview.com/tv.js" type="text/javascript" id="tradingViewWidget" />
       </Helmet>
       <SwiperProvider>
        <Container >
           {isDesktop ? <Desktop bids={bids} lastBidId={lastBidId}/> : <Mobile bids={bids} lastBidId={lastBidId}/>}
           <CollectWinningsPopup />
         </Container>
       </SwiperProvider>
    </>
  )
}

export default Predictions
