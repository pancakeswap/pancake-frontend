import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Button, Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const PredictionCardHeader: React.FC<{ preText: string; bnbWon: number }> = ({ preText, bnbWon }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  const bnbWonInUsd = multiplyPriceByAmount(bnbBusdPrice, bnbWon)

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd)

  return (
    <Heading color="#280D5F" my="8px" scale="xl" bold>
      {preText}
      {localisedBnbUsdString}
    </Heading>
  )
}

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const { data: bnbWon = 0 } = useSWR(loadData ? ['prediction', 'bnbWon'] : null, getTotalWon, {
    refreshInterval: SLOW_INTERVAL,
  })

  const bnbWonText = t('$%bnbWonInUsd% in BNB won so far', { bnbWonInUsd: '#placeholder#' })
  const [pretext, wonSoFar] = bnbWonText.split('#placeholder#')

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
        {bnbWon ? (
          <PredictionCardHeader preText={pretext} bnbWon={bnbWon} />
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
          {t('Will BNB price rise or fall? guess correctly to win!')}
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
