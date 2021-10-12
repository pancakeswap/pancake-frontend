import React, { useState } from 'react'
import debounce from 'lodash.debounce'
import { Flex, useMatchBreakpoints, Text } from '@rug-zombie-libs/uikit'
import { useParams } from 'react-router-dom'
import Container from './components/Container'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'
import { auction } from '../../redux/fetch'
import { useMausoleum, useMultiCall } from '../../hooks/useContract'
import { auctionById } from '../../redux/get'

interface ParamTypes {
  id: string
}

const Mausoleum = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  const [userInfo] = useState({})
  const [refresh, setRefresh] = useState(false)
  const { id } = useParams<ParamTypes>()
  const auctionId = parseInt(id)
  const { version } = auctionById(auctionId)
  const mausoleum = useMausoleum(version)
  const [updateAuctionInfo, setUpdateAuctionInfo] = useState(false)
  const [updateUserInfo, setUpdateUserInfo] = useState(false)

  const debouncedFetch = debounce(() => {
    auction(
      auctionId,
      mausoleum,
      { update: updateAuctionInfo, setUpdate: setUpdateAuctionInfo },
      { update: updateUserInfo, setUpdate: setUpdateUserInfo },
    )
  }, 1000)

  if (!updateAuctionInfo && !updateUserInfo) {
    debouncedFetch()
  }

  return (
    <>
      {!updateAuctionInfo && !updateUserInfo ? <>
        <Flex alignItems='center' justifyContent='center' mb='16px'>
          <img src='https://storage.googleapis.com/rug-zombie/BasicZombie.gif' alt='loading' />
        </Flex>
        <Flex alignItems='center' justifyContent='center' mb='16px'>
          <Text bold fontSize="30px">Entering Mausoleum</Text>
        </Flex>
      </> : <SwiperProvider>
        <Container>
          {isDesktop ? <Desktop refresh={refresh} setRefresh={setRefresh} id={auctionId} /> :
            <Mobile refresh={refresh} setRefresh={setRefresh} userInfo={userInfo} aid={auctionId} id={auctionId} />}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>}
    </>
  )
}

export default Mausoleum
