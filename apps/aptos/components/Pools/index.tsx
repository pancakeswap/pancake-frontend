import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, PageHeader, ScrollToTopButtonV2, Pool, Text } from '@pancakeswap/uikit'
import { Coin, ChainId } from '@pancakeswap/aptos-swap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import Portal from 'components/Portal'
import { useMemo } from 'react'
import { TokenPairImage } from 'components/TokenImage'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import NoSSR from '../NoSSR'
import PoolControls from './components/PoolControls'
import CardActions from './components/PoolCard/CardActions'

const PoolsPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  // const { data: pools } = usePoolsList()
  // const { isSuccess: userDataLoaded } = usePoolsUserData()

  const pools = useMemo(
    () => [
      {
        apr: 0,
        earningToken: new Coin(
          ChainId.TESTNET,
          '0x08c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB',
          8,
          'BNB',
          'BNB coin',
        ),
        earningTokenPrice: 0,
        isFinished: false,
        poolCategory: 'Core',
        profileRequirement: undefined,
        sousId: 0,
        stakingLimit: new BigNumber(0),
        stakingLimitEndBlock: 0,
        stakingToken: new Coin(
          ChainId.TESTNET,
          '0x08c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH',
          8,
          'ETH',
          'ETH coin',
        ),
        stakingTokenPrice: 0,
        startBlock: 0,
        tokenPerBlock: '12.86',
        totalStaked: new BigNumber(0),
        userData: {
          allowance: new BigNumber(0),
          pendingReward: new BigNumber(0),
          stakedBalance: new BigNumber(0),
          stakingTokenBalance: new BigNumber(0),
        },
      },
    ],
    [],
  )

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Syrup Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page title={t('Pools')}>
        <NoSSR>
          <PoolControls pools={pools}>
            {({ chosenPools }) => {
              return chosenPools.map((pool) => (
                <Pool.PoolCard<Coin>
                  key={pool.sousId}
                  pool={pool}
                  isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                  cardContent={
                    account ? (
                      <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                    ) : (
                      <>
                        <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                          {t('Start earning')}
                        </Text>
                        <ConnectWalletButton />
                      </>
                    )
                  }
                  tokenPairImage={
                    <TokenPairImage
                      primaryToken={pool.earningToken}
                      secondaryToken={pool.stakingToken}
                      width={64}
                      height={64}
                    />
                  }
                  cardFooter="Card Footer"
                  aprRow="Apr"
                />
              ))
            }}
          </PoolControls>
        </NoSSR>
      </Page>
    </>
  )
}

export default PoolsPage
