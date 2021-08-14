import React, { useMemo, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useBlock } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import AuctionCard from './components/GraveCard'
import PoolTabButtons from './components/PoolTabButtons'
import graves from '../../config/constants/graves'
import useWeb3 from '../../hooks/useWeb3'
import { BIG_TEN } from '../../utils/bigNumber'

let restorationChef


function getUserInfo(setState,gid, account) {
  if (typeof account !== 'undefined') {
    restorationChef.methods.userInfo(gid, account).call()
      .then((data) => {
        console.log('got user data')
        setState(data)
      })
      .catch((res) => {
        console.log(res)
      })
  }
}

function getgraveInfo() {
  restorationChef.methods.graveInfo(0).call()
    .then((data) => {
      // setState(data)
      console.log('itworked')
      console.log(data)
    })
    .catch((res) => {
      console.log(res)
    })
}

const Pools: React.FC = () => {
  // const { path } = useRouteMatch()
  // const { t } = useTranslation()
  // const { account } = useWeb3React()
  // const { currentBlock } = useBlock()
  // const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  //
  // const openGraves = graves.filter(grave => {
  //   return !grave.isFinished
  // })
  //
  // const hasStakeInFinishedPools = false
  //
  // restorationChef = getRestorationChefContract(getRestorationChefAddress())
  //
  // const [userInfo, setUserInfo] = useState({})
  // const [graveInfo, setGraveInfo] = useState({})
  //
  // getUserInfo(setUserInfo, 0, account)
  // getGraveInfo(setGraveInfo, gid, account)

  // const stakedOnlyPools = useMemo(
  //   () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
  //   [openPools],
  // )
  // const hasStakeInFinishedPools = useMemo(
  //   () => finishedPools.some((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
  //   [finishedPools],
  // )
  // This pool is passed explicitly to the cake vault
  // const cakePoolData = useMemo(() => openGraves.find((pool) => pool.sousId === 0), [openGraves])
  // const backgroundColor = "#101820"
  return <div/>
    // <>
      {/* <PageHeader background={backgroundColor}> */}
      {/*  <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}> */}
      {/*    <Flex flexDirection="column" mr={['8px', 0]}> */}
      {/*      <Heading as="h1" size="xxl" color="secondary" mb="24px"> */}
      {/*        {t('Graves')} */}
      {/*      </Heading> */}
      {/*      <Heading size="md" color="text"> */}
      {/*        {t('Resurrect rugged tokens.')} */}
      {/*      </Heading> */}
      {/*      <Heading size="md" color="text"> */}
      {/*        {t('Stake them for NFT rewards.')} */}
      {/*      </Heading> */}
      {/*    </Flex> */}
      {/*  </Flex> */}
      {/* </PageHeader> */}
      {/* <Page> */}
      {/*  <PoolTabButtons */}
      {/*    stakedOnly={stakedOnly} */}
      {/*    setStakedOnly={setStakedOnly} */}
      {/*    hasStakeInFinishedPools={hasStakeInFinishedPools} */}
      {/*  /> */}
      {/*  <FlexLayout> */}
      {/*    <Route exact path={`${path}`}> */}
      {/*      <> */}
      {/*        {openGraves.map(grave => { */}
      {/*          console.log('account') */}
      {/*          console.log(account) */}
      {/*          return <GraveCard grave={grave} gid={0} account={account} /> */}
      {/*        })} */}
      {/*      </> */}
      {/*    </Route> */}
      {/*    <Route path={`${path}/history`}> */}
      {/*       /!* {orderBy(finishedPools, ['sortOrder']).map((pool) => ( *!/ */}
      {/*       /!* <GraveCard key={pool.sousId} pool={pool} account={account} /> *!/ */}
      {/*       /!* ) )} *!/ */}
      {/*    </Route> */}
      {/*  </FlexLayout> */}
      {/*  <Image */}
      {/*    mx="auto" */}
      {/*    mt="12px" */}
      {/*    src="https://storage.googleapis.com/rug-zombie/running-zombie-1.png" */}
      {/*    alt="zombie running" */}
      {/*    width={207} */}
      {/*    height={142} */}
      {/*  /> */}
      {/* </Page> */}
    {/* </> */}

}

export default Pools
