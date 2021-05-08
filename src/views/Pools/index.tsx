import React, { useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@rug-zombie-libs/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useBlock } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import PoolCard from './components/PoolCard'
import FirstGraveCard from './components/TheMoonGraveCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'

const Pools: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [currentBlock, pools],
  )
  const stakedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )
  const hasStakeInFinishedPools = useMemo(
    () => finishedPools.some((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [finishedPools],
  )
  // This pool is passed explicitly to the cake vault
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])
  const backgroundColor = "#101820"
  return (
    <>
      <PageHeader background={backgroundColor}>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              {t('Graves')}
            </Heading>
            <Heading size="md" color="text">
              {t('Resurrect rugged tokens.')}
            </Heading>
            <Heading size="md" color="text">
              {t('Stake them for NFT rewards.')}
            </Heading>
          </Flex>
          <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <BountyCard />
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
              <FirstGraveCard pool={cakePoolData} account={account} />
              {/* {stakedOnly */}
              {/*  ? orderBy(stakedOnlyPools, ['sortOrder']).map((pool) => ( */}
              {/*      <PoolCard key={pool.sousId} pool={pool} account={account} /> */}
              {/*    )) */}
              {/*  : orderBy(openPools, ['sortOrder']).map((pool) => ( */}
              {/*      <PoolCard key={pool.sousId} pool={pool} account={account} /> */}
              {/*    ))} */}
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} account={account} />
            ))}
          </Route>
        </FlexLayout>
        <Image
          mx="auto"
          mt="12px"
          src="/images/running-zombie-1.png"
          alt="zombie running"
          width={207}
          height={142}
        />
      </Page>
    </>
  )
}

export default Pools
