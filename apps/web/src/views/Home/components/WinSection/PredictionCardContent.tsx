import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Button, Flex, Heading, Skeleton, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatLocalisedCompactNumber } from '@pancakeswap/utils/formatBalance'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { getTotalWon } from 'state/predictions/helpers'
import { useCakePrice } from 'hooks/useCakePrice'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import { useBNBPrice } from 'hooks/useBNBPrice'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const PredictionCardHeader: React.FC<React.PropsWithChildren<{ preText: string; won: string }>> = ({
  preText,
  won,
}) => {
  return (
    <Heading color="#280D5F" my="8px" scale="xl" bold>
      {preText}
      {won}
    </Heading>
  )
}

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = useBNBPrice()
  const cakePrice = useCakePrice()

  const { data } = useSWR(loadData ? ['prediction', 'tokenWon'] : null, getTotalWon, {
    refreshInterval: SLOW_INTERVAL,
  })

  const bnbWonInUsd = bnbBusdPrice.multipliedBy(data?.totalWonBNB || 0).toNumber()
  const cakeWonInUsd = cakePrice.multipliedBy(data?.totalWonCAKE || 0).toNumber()

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd + cakeWonInUsd)
  const bnbWonText = t('$%wonInUsd% in BNB + CAKE won so far', { wonInUsd: localisedBnbUsdString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnbUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </Text>
        {bnbWonInUsd ? (
          <PredictionCardHeader preText={pretext} won={localisedBnbUsdString} />
        ) : (
          <>
            <Skeleton width={230} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="#280D5F" mb="24px" bold fontSize="16px">
          {wonSoFar}
        </Text>
        <Text color="#280D5F" mb="40px">
          {t('Predict the price trend of BNB or CAKE to win')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/prediction" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
