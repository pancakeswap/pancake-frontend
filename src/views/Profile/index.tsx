import React, { useEffect, useState } from 'react'
import { Heading, LinkExternal, Text, CardsLayout, Skeleton } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import PageHeader from 'components/PageHeader'
import { graves, nfts, tombs, zombiePriceUsd } from 'redux/get'
import styled from 'styled-components'

import { initialTombData, nftUserInfo } from 'redux/fetch'
import { useNftOwnership, useMultiCall, useDrFrankenstein, useZombieBalanceChecker } from 'hooks/useContract'
import { BigNumber } from 'bignumber.js'
import StakedGraves from './components/StakedGraves'
import SwiperProvider from '../Predictions/context/SwiperProvider'
import CollectiblesCard from '../Graveyard/components/Collectibles/CollectiblesCard'
import './Profile.Styles.css'
import Avatar from './components/Avatar'
import StakedTombs from './components/StakedTombs'
import { BIG_ZERO } from '../../utils/bigNumber'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from '../../utils/formatBalance'
import StakedSpawningPools from './components/StakedSpawningPools'

const Row = styled.div`
  display: flex
`

const Col = styled.div`
  flex: 1;
  padding: 10px;
`
const StyledCollectibleCard = styled(CollectiblesCard)`
  width: 20px;
  height: 20px;
`
const Profile: React.FC = () => {
  const contract = useNftOwnership()
  const drFrankenstein = useDrFrankenstein()
  const [updateUserInfo, setUpdateUserInfo] = useState(false)
  const [updatePoolInfo, setUpdatePoolInfo] = useState(false)
  const [updateEvery, setUpdateEvery] = useState(false)
  const [stakedInGraves, setStakedInGraves] = useState(BIG_ZERO)
  const [stakedInSpawningPools, setStakedInSpawningPools] = useState(BIG_ZERO)
  const multi = useMultiCall()
  const zombieBalanceChecker = useZombieBalanceChecker()
  useEffect(() => {
    if (!updateUserInfo) {
      nftUserInfo(contract, { update: updateUserInfo, setUpdate: setUpdateUserInfo })
    }
  }, [contract, updateUserInfo])
  useEffect(() => {
    initialTombData(
      multi,
      { update: updatePoolInfo, setUpdate: setUpdatePoolInfo },
      { update: updateUserInfo, setUpdate: setUpdateUserInfo },
    )
  }, [drFrankenstein.methods, multi, updatePoolInfo, updateUserInfo])
  const { account } = useWeb3React()
  const ownedNfts = nfts().filter(nft => nft.userInfo.ownedIds.length > 0)
  const stakedGraves = graves().filter(g => !g.userInfo.amount.isZero())
  const stakedTombs = tombs().filter(t => t.userInfo.amount.gt(0))
  const refresh = () => {
    nftUserInfo(contract, { update: updateEvery, setUpdate: setUpdateEvery })
  }

  useEffect(() => {
    if (account) {
      zombieBalanceChecker.methods.getGraves(account).call()
        .then(res => {
          setStakedInGraves(new BigNumber(res))
        })
    }
  }, [account, zombieBalanceChecker.methods])

  useEffect(() => {
    if (account) {
      zombieBalanceChecker.methods.getSpawningPools(account).call()
        .then(res => {
          setStakedInSpawningPools(new BigNumber(res))
        })
    }
  }, [account, zombieBalanceChecker.methods])

  const zombiePrice = zombiePriceUsd()
  const totalStaked = stakedInGraves.plus(stakedInSpawningPools)

  return (
    <>
      <PageHeader background='#101820'>
        <Heading size='md' color='text'>
          Profile
        </Heading>
      </PageHeader>
      <Row>
        <Avatar />
        <LinkExternal href={`https://bscscan.com/address/${account}`}>
          <Text>{account}</Text>
        </LinkExternal>
      </Row>
      <Heading color='text' size='md' className='staked-graves-header'>
        Total Zombie Staked
        <Text>
          {getFullDisplayBalance(totalStaked, 18, 4)} ZMBE
        </Text>
        <Text fontSize='12px' color='textSubtle'>{`~${
          totalStaked.isZero() ? '0.00' : getBalanceAmount(totalStaked, 18).times(zombiePrice).toFormat(2)
        } USD`}
        </Text>
      </Heading>

      <Heading color='text' size='md' className='staked-graves-header'>
        Staked Graves
      </Heading>
      <StakedGraves stakedGraves={stakedGraves} />
      <Heading color='text' size='md' className='staked-graves-header'>
        Staked Tombs
      </Heading>
      <StakedTombs stakedTombs={stakedTombs} />
      <Heading color='text' size='md' className='staked-graves-header'>
        Staked Spawning Pools
      </Heading>
      <StakedSpawningPools zombieStaked={stakedInSpawningPools} />
      <Heading color='text' size='md' className='staked-graves-header'>
        Collectibles
        <Text>
          RugZombie collectibles are special ERC-721 NFTs that can be used on the RugZombie platform.
          NFTs in this user&apos;s wallet that aren&apos;t approved by RugZombie collectibles won&apos;t be shown here.
        </Text>
      </Heading>
      <SwiperProvider>
        <Row>
          <CardsLayout>
            {ownedNfts.map((nft) => {
              return (<Col>
                  <StyledCollectibleCard id={nft.id} key={nft.id} refresh={refresh} />
                </Col>
              )
            })
            }
          </CardsLayout>
        </Row>
      </SwiperProvider>
    </>
  )
}

export default Profile