import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, ArrowForwardIcon, Link, Button, Text, Skeleton, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getTotalWon } from 'state/predictions/helpers'
import { usePriceBnbBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import Balance from '../../../components/Balance'

const StyledPredictionCard = styled(Card)`
  background-image: url('/images/prediction_promotion.png');
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: 50%;
  min-height: 376px;
  ${({ theme }) => theme.mediaQueries.sm} {
    background-size: 45%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 50%;
  }
`

const StyledHeaderText = styled(Text)`
  font-size: 28px;
  line-height: 1.1;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const StyledText = styled(Text)`
  font-size: 36px;
  line-height: 1.1;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 50px;
  }
`

const StyledBalance = styled(Balance)`
  font-size: 36px;
  line-height: 1.1;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 50px;
  }
`

const StyledSkeleton = styled(Skeleton)`
  height: 40px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 55px;
  }
`

const StyledBNBSoFarText = styled(Text)`
  font-size: 22px;
  line-height: 1.1;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 24px;
  }
`

const PredictionPromotionCard = () => {
  const { t } = useTranslation()
  const { slowRefresh } = useRefresh()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = usePriceBnbBusd()
  const [bnbWon, setBnbWon] = useState(0)
  const [bnbWonInUsd, setBnbWonInUsd] = useState(0)

  // Fetch farm data once to get the max APR
  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const fetchMarketData = async () => {
      const totalWon = await getTotalWon()
      setBnbWon(totalWon)
    }

    if (loadData) {
      fetchMarketData()
    }
  }, [slowRefresh, loadData])

  useEffect(() => {
    if (bnbBusdPrice.gt(0) && bnbWon > 0) {
      setBnbWonInUsd(bnbBusdPrice.times(bnbWon).toNumber())
    }
  }, [bnbBusdPrice, bnbWon])

  const bnbWonInUsdText = bnbWonInUsd ? bnbWonInUsd.toString() : '-'
  const wonBNBText = t('Over %amount% in BNB won so far', { amount: bnbWonInUsdText })
  const [over, bnbSoFar] = wonBNBText.split(bnbWonInUsdText)

  return (
    <StyledPredictionCard>
      <CardBody>
        <StyledHeaderText mb="24px">{t('Predictions Now Live')}</StyledHeaderText>
        <StyledText bold color="#7645d9">
          {over}
        </StyledText>
        {bnbWonInUsd ? (
          <StyledBalance mb="24px" color="#7645d9" bold prefix="$" decimals={0} value={bnbWonInUsd} />
        ) : (
          <>
            <StyledSkeleton animation="pulse" variant="rect" mb="24px" width={180} />
            <div ref={observerRef} />
          </>
        )}
        <StyledBNBSoFarText bold mb="24px">
          {bnbSoFar}
        </StyledBNBSoFarText>
        <Text color="textSubtle" mb="24px">
          *{t('Beta Version')}
        </Text>
        <Link href="https://pancakeswap.finance/prediction" id="homepage-prediction-cta">
          <Button px={['14px', null, null, null, '20px']}>
            <Flex alignItems="center">
              <Text color="white" bold fontSize="16px">
                {t('Try Now')}
              </Text>
              <ArrowForwardIcon color="white" />
            </Flex>
          </Button>
        </Link>
      </CardBody>
    </StyledPredictionCard>
  )
}

export default PredictionPromotionCard
