import { ArrowForwardIcon, Balance, Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useEffect, useState } from 'react'

import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCakePrice } from 'hooks/useCakePrice'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { styled } from 'styled-components'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const cakePrice = useCakePrice()
  const { data: currentLotteryId } = useQuery({
    queryKey: ['currentLotteryId'],
    queryFn: fetchCurrentLotteryId,
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { data: currentLottery } = useQuery({
    queryKey: ['currentLottery'],
    queryFn: async () => fetchLottery(currentLotteryId?.toString() ?? ''),
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const cakePrizesText = t('%cakePrizeInUsd% in CAKE prizes this round', { cakePrizeInUsd: cakePrice.toString() })
  const [pretext, prizesThisRound] = cakePrizesText.split(cakePrice.toString())
  const amountCollectedInCake = currentLottery ? parseFloat(currentLottery.amountCollectedInCake) : null
  const currentLotteryPrize = amountCollectedInCake ? cakePrice.times(amountCollectedInCake) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="white" bold fontSize="16px">
          {t('Lottery')}
        </Text>
        {pretext && (
          <Text color="white" mt="12px" bold fontSize="16px">
            {pretext}
          </Text>
        )}
        {currentLotteryPrize && currentLotteryPrize.gt(0) ? (
          <StyledBalance
            fontSize="40px"
            bold
            prefix="$"
            decimals={0}
            value={getBalanceAmount(currentLotteryPrize).toNumber()}
          />
        ) : (
          <>
            <Skeleton width={200} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="white" mb="24px" bold fontSize="16px">
          {prizesThisRound}
        </Text>
        <Text color="white" mb="40px">
          {t('Buy tickets with CAKE, win CAKE if your numbers match')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/lottery" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Buy Tickets')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default LotteryCardContent
