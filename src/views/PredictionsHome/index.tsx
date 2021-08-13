import React, { useState } from 'react'
import { getBep20Contract, getContract } from 'utils/contractHelpers'
import { Heading, Flex, Image, Button, Input } from '@rug-zombie-libs/uikit'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { Route, useRouteMatch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import PoolTabButtons from './components/PoolTabButtons'
import FlexLayout from '../../components/layout/Flex'
import GraveCard from './components/GraveCard'
import usePersistState from '../../hooks/usePersistState'
import graves from '../../config/constants/graves'
import { getAddress, getZombieAddress } from '../../utils/addressHelpers'
import useTokenBalance from '../../hooks/useTokenBalance'
import { zombiePriceUsd } from '../../redux/get'
import auctions from '../../redux/auctions'

let web3
let restorationChef
const isLoading = true

const ONE = BIG_TEN.pow(18)
const hasStakeInFinishedPools = false

const defaultUser = {
  paidUnlockingFee: false,
  withdrawalDate: 0,
  rugDeposited: 0,
  zombieStaked: 0,
}

const userData = {}
const balances = {
  zombie: 0,
  rug: 0
}


function getUserInfo(gid, account) {
  if(typeof account !== "undefined") {
    // restorationChef.methods.userInfo(gid, account).call()
    //   .then((data) => {
    //     isLoading=false
    //     userData[gid] = data
    //   })
    //   .catch(() => {
    //     console.log("Failed to get user data")
    //   })
  }
}

function getgraveInfo(gid, setState) {
  // restorationChef.methods.graveInfo(gid).call()
  //   .then((data) => {
  //     setState(data)
  //     console.log(data)
  //   })
  //   .catch((res) => {
  //     console.log(res)
  //   })
}

const PredictionsHome: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWeb3React()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const zombiePriceInBusd = zombiePriceUsd()
  getUserInfo(0, account)
  const zombieBalance = useTokenBalance(getZombieAddress())
  console.log(zombieBalance.toString())
  const openGraves = auctions
  const backgroundColor = '#101820'

  return (
    <>
       <PageHeader background={backgroundColor}>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              Mausoleum
            </Heading>
            <Heading size="md" color="text">
              Participate in auctions to win one of a kind NFTs
            </Heading>
            <Heading size="md" color="text">
              Remember to withdraw your previous bids
            </Heading>
          </Flex>
        </Flex>
       </PageHeader>
      <Page>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
          />
          <FlexLayout>
            <Route exact path={`${path}`}>
              <>
                {/* {openGraves.map(grave => { */}
                {/*  return <GraveCard */}
                {/*    auctionId={grave.aid} */}
                {/*  /> */}
                {/* })} */}
              </>
            </Route>
            <Route path={`${path}/history`}>
               {/* {orderBy(finishedPools, ['sortOrder']).map((pool) => ( */}
               {/* <GraveCard key={pool.sousId} pool={pool} account={account} /> */}
               {/* ) )} */}
            </Route>
          </FlexLayout>
          <Image
            mx="auto"
            mt="12px"
            src="https://storage.googleapis.com/rug-zombie/running-zombie-1.png"
            alt="zombie running"
            width={207}
            height={142}
          />
      </Page>
    </>
  )
}

export default PredictionsHome
