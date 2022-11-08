import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, PageHeader, ScrollToTopButtonV2, Pool, Text, FlexLayout } from '@pancakeswap/uikit'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'

import Page from 'components/Layout/Page'
import Portal from 'components/Portal'
import { TokenPairImage } from 'components/TokenImage'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import NoSSR from '../NoSSR'
import PoolControls from './components/PoolControls'
import CardActions from './components/PoolCard/CardActions'
import Apr from './components/PoolCard/Apr'
import CardFooter from './components/PoolCard/CardFooter'
import PoolStatsInfo from './components/PoolCard/PoolStatsInfo'
import CakeCardActions from './components/PoolCard/CakeCardActions'
import { usePoolsList } from './hooks/usePoolsList'
import { CAKE_PID } from './constants'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolsPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const pools = usePoolsList()

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
              return (
                <CardLayout>
                  {chosenPools.map((pool: Pool.DeserializedPool<Coin>) => (
                    <Pool.PoolCard<Coin>
                      key={pool.sousId}
                      pool={pool}
                      isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                      cardContent={
                        account ? (
                          pool?.sousId === CAKE_PID ? (
                            <CakeCardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                          ) : (
                            <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                          )
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
                          primaryToken={pool.earningToken as Coin}
                          secondaryToken={pool.stakingToken as Coin}
                          width={64}
                          height={64}
                        />
                      }
                      cardFooter={
                        <CardFooter>
                          <PoolStatsInfo account={account} pool={pool} />
                        </CardFooter>
                      }
                      aprRow={<Apr pool={pool} stakedBalance={pool?.userData?.stakedBalance} showIcon={false} />}
                    />
                  ))}
                </CardLayout>
              )
            }}
          </PoolControls>
        </NoSSR>
      </Page>
    </>
  )
}

export default PoolsPage
