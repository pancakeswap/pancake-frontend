import React, { useState, useEffect } from 'react'
import { Flex, Text, Skeleton, Link, Button, ArrowForwardIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { usePriceBnbBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  width: 100%;
`

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { slowRefresh } = useRefresh()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = usePriceBnbBusd()
  const [bnbWon, setBnbWon] = useState(0)
  const [bnbWonInUsd, setBnbWonInUsd] = useState(0)

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

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <div ref={observerRef} />
        <Text bold fontSize="16px">
          {t('Prediction')}
        </Text>
        {bnbWonInUsd ? (
          <Balance fontSize="40px" bold prefix="$" decimals={0} value={bnbWonInUsd} />
        ) : (
          <>
            <Skeleton width={230} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text mb="24px" bold fontSize="16px">
          {t('in BNB won so far')}
        </Text>
        <Text mb="40px">{t('Will BNB price rise or fall? guess correctly to win!')}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink href="/prediction" id="homepage-prediction-cta">
          <Button width="100%">
            {t('Play')}
            <ArrowForwardIcon ml="4px" color="white" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
