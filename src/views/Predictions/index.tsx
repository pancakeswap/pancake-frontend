import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMatchBreakpoints, useModal } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'bignumber.js'
import { useParams } from 'react-router-dom'
import mausoleumAbi from 'config/abi/mausoleum.json'
import Container from './components/Container'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'
import { getMausoleumContract } from '../../utils/contractHelpers'
import { auction, initialData } from '../../redux/fetch'
import auctions from '../../redux/auctions'
import useWeb3 from '../../hooks/useWeb3'
import { useMausoleum, useMultiCall } from '../../hooks/useContract'
import { auctionById } from '../../redux/get'

interface ParamTypes {
  id: string
}

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const [bids, setBids] = useState([])
  const [lastBidId, setLastBidId] = useState(0)
  const [userInfo, setUserInfo] = useState({})
  const [refresh, setRefresh] = useState(false)
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const multi = useMultiCall()
  initialData(account, multi)
  const { id } = useParams<ParamTypes>()
  const auctionId = parseInt(id)
  const { aid, version } = auctionById(auctionId)
  const mausoleum = useMausoleum(version)
  const [updateAuctionInfo, setUpdateAuctionInfo] = useState(false)
  const [updateUserInfo, setUpdateUserInfo] = useState(false)

  useEffect(() => {
    auction(
      auctionId,
      mausoleum,
      multi,
      { update: updateAuctionInfo, setUpdate: setUpdateAuctionInfo },
      { update: updateUserInfo, setUpdate: setUpdateUserInfo },
    )
  }, [auctionId, mausoleum, multi, updateAuctionInfo, updateUserInfo])

  return (
    <>
       <Helmet>
        <script src="https://s3.tradingview.com/tv.js" type="text/javascript" id="tradingViewWidget" />
       </Helmet>
       <SwiperProvider>
        <Container>
           {isDesktop ? <Desktop refresh={refresh} bids={bids} lastBidId={lastBidId} setRefresh={setRefresh} id={auctionId} /> :
            <Mobile refresh={refresh} bids={bids} lastBidId={lastBidId} setRefresh={setRefresh} userInfo={userInfo} aid={auctionId} id={auctionId}/>}
           <CollectWinningsPopup />
         </Container>
       </SwiperProvider>
    </>
  )
}

export default Predictions
