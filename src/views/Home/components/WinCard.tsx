import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Skeleton } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useGetCurrentLotteryId, useLottery, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useAppDispatch } from 'state'
import { fetchCurrentLottery, fetchCurrentLotteryId } from 'state/lottery'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }

  transition: opacity 200ms;
  &:hover {
    opacity: 0.65;
  }
`

const WinCard = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()

  const {
    currentRound: { amountCollectedInCake },
  } = useLottery()
  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    // get current lottery ID, max tickets and historical lottery subgraph data
    if (loadData) {
      dispatch(fetchCurrentLotteryId())
    }
  }, [dispatch, loadData])

  useEffect(() => {
    // get public data for current lottery
    if (currentLotteryId) {
      dispatch(fetchCurrentLottery({ currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, slowRefresh])

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-cta">
        <CardBody>
          <Heading color="contrast" scale="lg" mb="2px">
            {t('Lottery')} V2
          </Heading>
          {prizeInBusd.isNaN() ? (
            <>
              <Skeleton height={60} width={190} />
              <div ref={observerRef} />
            </>
          ) : (
            <Balance fontSize="40px" color="#7645d9" bold prefix="$" decimals={0} value={prizeTotal} />
          )}
          <Flex justifyContent="space-between">
            <Heading color="contrast" scale="lg">
              {t('in prizes!')}
            </Heading>
            <ArrowForwardIcon mt={30} color="primary" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default WinCard
