import React, { useState } from 'react'
import { getContract, getMasterchefContract, getRestorationChefContract } from 'utils/contractHelpers'
import { Heading, Flex, Image, Button, Input } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { Route, useRouteMatch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import RestorationChefAbi from '../Admin/abis/RestorationChefAbi.json'
import useWeb3 from '../../hooks/useWeb3'
import { BIG_TEN } from '../../utils/bigNumber'
import PoolTabButtons from './components/PoolTabButtons'
import FlexLayout from '../../components/layout/Flex'
import GraveCard from './components/GraveCard'
import usePersistState from '../../hooks/usePersistState'
import graves from '../../config/constants/graves'
import { usePriceZombieBusd } from '../../state/hooks'

let web3
let restorationChef
let isLoading = true

const ONE = BIG_TEN.pow(18)
const hasStakeInFinishedPools = false

async function InitWeb3() {
  web3 = useWeb3()
  restorationChef = getContract(RestorationChefAbi,"0xf3a866B431daB1925A8085D3F189248BE53e5cbd", web3)
}

const userData = {}
const defaultUser = {
  paidUnlockingFee: false,
  rugDeposited: 0,
  withdrawalDate: 0,
  zombieStaked: 0
}

function getUserInfo(gid, account) {
  if(typeof account !== "undefined") {
    restorationChef.methods.userInfo(gid, account).call()
      .then((data) => {
        isLoading=false
        userData[gid] = data
      })
      .catch(() => {
        console.log("Failed to get user data")
      })
  }
}

function getgraveInfo(gid, setState) {
  restorationChef.methods.graveInfo(gid).call()
    .then((data) => {
      setState(data)
      console.log(data)
    })
    .catch((res) => {
      console.log(res)
    })
}

const Admin: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWeb3React()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const zombiePriceInBusd = usePriceZombieBusd()

  InitWeb3()
  getUserInfo(0, account)

  const openGraves = graves.filter(grave => {
    return !grave.isFinished
  })
  const backgroundColor = '#101820'

  return (
    <>
       <PageHeader background={backgroundColor}>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              Graves
            </Heading>
            <Heading size="md" color="text">
              Resurrect rugged tokens.
            </Heading>
            <Heading size="md" color="text">
              Stake them for NFT rewards.
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
                {openGraves.map(grave => {
                  const user = (typeof userData[grave.gid]) === "undefined" ? defaultUser : userData[grave.gid]
                  return <GraveCard grave={grave} zombiePrice={zombiePriceInBusd} userData={user} gid={grave.gid} account={account} isLoading={isLoading} />
                })}
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

export default Admin
