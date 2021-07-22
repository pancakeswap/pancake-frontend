import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Card, CardBody, ChartIcon, Box, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { usePriceBnbBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'

const StyledCard = styled(Card)<{ background: string; borderColor: string; rotation?: string }>`
  background: ${({ background }) => background};
  border: 2px solid ${({ borderColor }) => borderColor};
  box-sizing: border-box;
  box-shadow: 0px 4px 0px ${({ borderColor }) => borderColor};
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
`

const IconWrapper = styled(Box)<{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
`

const PredictionCardContent = () => {
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

  if (bnbWonInUsd) {
    console.log(bnbWonInUsd)
    debugger // eslint-disable-line
  }

  return (
    <Flex flexDirection="column">
      <div ref={observerRef} />
      <Text bold fontSize="16px">
        {t('Prediction')}
      </Text>
      {bnbWonInUsd ? (
        <Balance mb="24px" bold prefix="$" decimals={0} value={bnbWonInUsd} />
      ) : (
        <>
          <Skeleton width={180} />
          <div ref={observerRef} />
        </>
      )}
      <Text mb="24px" bold fontSize="16px">
        {t('in BNB won so far')}
      </Text>
      <Text mb="40px">{t('Will BNB price rise or fall? guess correctly to win!')}</Text>
    </Flex>
  )
}

const IconCard = () => {
  const icon = <ChartIcon />
  const background = 'linear-gradient(180deg, #ffb237 0%, #ffcd51 51.17%, #ffe76a 100%);'
  const borderColor = '#ffb237'
  const rotation = '-2.36deg'

  return (
    <StyledCard background={background} borderColor={borderColor} rotation={rotation}>
      <CardBody>
        <IconWrapper rotation={rotation}>{icon}</IconWrapper>
        <PredictionCardContent />
      </CardBody>
    </StyledCard>
  )
}

export default IconCard
