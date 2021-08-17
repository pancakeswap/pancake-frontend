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
import AuctionCard from './components/GraveCard'
import { auctions } from '../../redux/get'

const PredictionsHome: React.FC = () => {
  const { path } = useRouteMatch()
  const [visibleAuctions, setVisibleAuctions] = useState(auctions())
  const backgroundColor = '#101820'
  const ids = visibleAuctions.reverse().map(a => a.id)
  let key = -1
  return (
    <>
      <PageHeader background={backgroundColor}>
        <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
          <Flex flexDirection='column' mr={['8px', 0]}>
            <Heading as='h1' size='xxl' color='secondary' mb='24px'>
              Mausoleum
            </Heading>
            <Heading size='md' color='text'>
              Participate in auctions to win one of a kind NFTs
            </Heading>
            <Heading size='md' color='text'>
              Remember to withdraw your previous bids
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolTabButtons
          setAuctions={setVisibleAuctions}
        />
        <FlexLayout>

          {visibleAuctions.reverse().map(auction => {
            key += 1
            return <AuctionCard id={ids[key]} key={key} />
          })}
          <Route path={`${path}/history`}>
            {/* {orderBy(finishedPools, ['sortOrder']).map((pool) => ( */}
            {/* <GraveCard key={pool.sousId} pool={pool} account={account} /> */}
            {/* ) )} */}
          </Route>
        </FlexLayout>
        <Image
          mx='auto'
          mt='12px'
          src='https://storage.googleapis.com/rug-zombie/running-zombie-1.png'
          alt='zombie running'
          width={207}
          height={142}
        />
      </Page>
    </>
  )
}

export default PredictionsHome
