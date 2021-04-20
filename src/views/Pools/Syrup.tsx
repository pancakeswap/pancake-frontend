import React, { useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Button, Text, HelpIcon, Link } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import usePersistState from 'hooks/usePersistState'
import { usePools, useBlock } from 'state/hooks'
import PageHeader from 'components/PageHeader'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledLink = styled(Link)`
  display: inline;
  height: fit-content;
`

const Syrup: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
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

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              {TranslateString(999, 'Syrup Pools')}
            </Heading>
            <Heading size="md" color="text">
              {TranslateString(999, 'Simply stake tokens to earn.')}
            </Heading>
            <Heading size="md" color="text">
              {TranslateString(999, 'High APR, low risk.')}
            </Heading>
          </Flex>
          <Flex>
            <StyledLink color="backgroundAlt" href="https://docs.pancakeswap.finance/syrup-pools/syrup-pool" external>
              <Button px={['14px', null, null, null, '24px']} variant="subtle">
                <ButtonText color="backgroundAlt" fontSize="16px" bold>
                  {TranslateString(999, 'Help')}
                </ButtonText>
                <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} />
              </Button>
            </StyledLink>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stakedOnly
                ? orderBy(stakedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
              <Coming />
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} />
            ))}
          </Route>
        </FlexLayout>
      </Page>
    </>
  )
}

export default Syrup
