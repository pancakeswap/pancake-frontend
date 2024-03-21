import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, FlexLayout, Heading, PageHeader, Text, ViewMode } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import Page from 'components/Layout/Page'
import { AptRewardTooltip } from 'components/Pools/components/PoolTable/AptRewardTooltip'
import { UsUserAptRewardTooltips } from 'components/Pools/components/PoolTable/UsUserAptRewardTooltips'
import { TokenPairImage } from 'components/TokenImage'
import { APT } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { styled } from 'styled-components'
import NoSSR from '../NoSSR'
import Apr from './components/PoolCard/Apr'
import CakeCardActions from './components/PoolCard/CakeCardActions'
import CardActions from './components/PoolCard/CardActions'
import CardFooter from './components/PoolCard/CardFooter'
import PoolStatsInfo from './components/PoolCard/PoolStatsInfo'
import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolTable/PoolRow'
import { usePoolsList } from './hooks/usePoolsList'
import isVaultPool from './utils/isVaultPool'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolsPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const pools = usePoolsList()
  const isUserIpPass = useCheckIsUserIpPass()

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
            {({ chosenPools, viewMode, normalizedUrlSearch }) => {
              return viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool: Pool.DeserializedPool<Coin>) => (
                    <Pool.PoolCard<Coin>
                      key={pool.contractAddress}
                      pool={pool}
                      isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                      cardContent={
                        account ? (
                          isVaultPool() ? (
                            <CakeCardActions
                              hideLocateAddress
                              pool={pool}
                              stakedBalance={pool?.userData?.stakedBalance}
                            />
                          ) : (
                            <CardActions
                              hideLocateAddress
                              pool={pool}
                              stakedBalance={pool?.userData?.stakedBalance}
                              usUserTooltipComponent={<UsUserAptRewardTooltips pool={pool} />}
                              disabledHarvestButton={
                                account &&
                                !isUserIpPass &&
                                pool.earningToken.address.toLowerCase() ===
                                  APT[pool.earningToken.chainId].address.toLowerCase()
                              }
                            />
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
                      aprRow={
                        <Pool.AprRowWithToolTip>
                          <Apr pool={pool} stakedBalance={pool?.userData?.stakedBalance} showIcon={false} />
                        </Pool.AprRowWithToolTip>
                      }
                      headerTooltipComponent={<AptRewardTooltip pool={pool} />}
                    />
                  ))}
                </CardLayout>
              ) : (
                <Pool.PoolsTable>
                  {chosenPools.map((pool) => (
                    <PoolRow
                      initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                      key={pool.contractAddress}
                      sousId={pool.sousId}
                      account={account}
                      pool={pool}
                    />
                  ))}
                </Pool.PoolsTable>
              )
            }}
          </PoolControls>
        </NoSSR>
      </Page>
    </>
  )
}

export default PoolsPage
