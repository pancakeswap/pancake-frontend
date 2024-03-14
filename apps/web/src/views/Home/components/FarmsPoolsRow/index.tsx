import { Token } from '@pancakeswap/sdk'
import { Box, Flex, IconButton, SwapVertIcon } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { useVaultApy } from 'hooks/useVaultApy'
import toNumber from 'lodash/toNumber'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import useGetTopPoolsByApr from 'views/Home/hooks/useGetTopPoolsByApr'
import RowHeading from './RowHeading'
import TopFarmPool from './TopFarmPool'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(5, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
  }
`

const FarmsPoolsRow = () => {
  const [showFarms, setShowFarms] = useState(true)
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { topFarms, fetched, chainId } = useGetTopFarmsByApr(isIntersecting)
  const { topPools } = useGetTopPoolsByApr(fetched && isIntersecting, chainId)
  const { lockedApy } = useVaultApy()

  const timer = useRef<NodeJS.Timeout | null>(null)
  const isLoaded = topFarms[0] && topPools[0]

  const startTimer = useCallback(() => {
    timer.current = setInterval(() => {
      setShowFarms((prev) => !prev)
    }, 6000)
  }, [timer])

  useEffect(() => {
    if (isLoaded) {
      startTimer()
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [timer, isLoaded, startTimer])

  const getPoolText = useCallback(
    (pool: Pool.DeserializedPool<Token>) => {
      if (pool.vaultKey) {
        return vaultPoolConfig[pool.vaultKey].name
      }

      return t('Stake %stakingSymbol% - Earn %earningSymbol%', {
        earningSymbol: pool.earningToken.symbol,
        stakingSymbol: pool.stakingToken.symbol,
      })
    },
    [t],
  )

  return (
    <div ref={observerRef}>
      <Flex flexDirection="column" mt="24px">
        <Flex mb="24px">
          <RowHeading text={showFarms ? t('Top Farms') : t('Top Syrup Pools')} />
          <IconButton
            variant="text"
            height="100%"
            width="auto"
            onClick={() => {
              setShowFarms((prev) => !prev)
              if (timer.current) clearInterval(timer.current)
              startTimer()
            }}
          >
            <SwapVertIcon height="24px" width="24px" color="textSubtle" />
          </IconButton>
        </Flex>
        <Box height={['240px', null, '80px']}>
          <Grid>
            {topFarms.map((topFarm, index) => (
              <TopFarmPool
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                title={
                  topFarm?.lpSymbol &&
                  // eslint-disable-next-line no-useless-concat
                  `${topFarm?.lpSymbol}` + `${topFarm?.version === 3 ? ` v${topFarm.version}` : ''}`
                }
                version={topFarm?.version}
                percentage={toNumber(topFarm?.apr) + toNumber(topFarm?.lpRewardsApr)}
                index={index}
                visible={showFarms}
              />
            ))}
          </Grid>
          <Grid>
            {topPools.map((topPool, index) => (
              <TopFarmPool
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                title={topPool && getPoolText(topPool)}
                percentage={topPool?.sousId === 0 ? +lockedApy : topPool?.apr}
                index={index}
                visible={!showFarms}
              />
            ))}
          </Grid>
        </Box>
      </Flex>
    </div>
  )
}

export default FarmsPoolsRow
