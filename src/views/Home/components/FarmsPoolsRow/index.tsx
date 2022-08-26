import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Box, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DeserializedPool } from 'state/types'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import useGetTopPoolsByApr from 'views/Home/hooks/useGetTopPoolsByApr'
import { vaultPoolConfig } from 'config/constants/pools'
import { useVaultApy } from 'hooks/useVaultApy'
import TopFarmPool from './TopFarmPool'
import RowHeading from './RowHeading'

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
  const [showFarms, setShowFarms] = useState(false)
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { topFarms, fetched } = useGetTopFarmsByApr(isIntersecting)
  const { topPools } = useGetTopPoolsByApr(fetched && isIntersecting)
  const { lockedApy } = useVaultApy()

  const timer = useRef<ReturnType<typeof setTimeout>>(null)
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
      clearInterval(timer.current)
    }
  }, [timer, isLoaded, startTimer])

  const getPoolText = (pool: DeserializedPool) => {
    if (pool.vaultKey) {
      return vaultPoolConfig[pool.vaultKey].name
    }

    return t('Stake %stakingSymbol% - Earn %earningSymbol%', {
      earningSymbol: pool.earningToken.symbol,
      stakingSymbol: pool.stakingToken.symbol,
    })
  }

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
              clearInterval(timer.current)
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
                title={topFarm?.lpSymbol}
                percentage={topFarm?.apr + topFarm?.lpRewardsApr}
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
                isApy={topPool?.sousId === 0}
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
