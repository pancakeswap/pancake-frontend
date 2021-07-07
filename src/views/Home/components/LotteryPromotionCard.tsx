import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Skeleton, Text } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

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

const PrizeText = styled(Text)`
  word-wrap: break-word;
`

const LotteryPromotionCard: React.FC<{ currentLotteryPrize: string }> = ({ currentLotteryPrize }) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = cakePriceBusd.times(currentLotteryPrize)
  const prizeTotal = getBalanceNumber(prizeInBusd)

  const prizeTotalText = prizeInBusd.isNaN() ? prizeTotal.toString() : '-'
  const prizeText = t('Over %amount% in Prizes!', { amount: prizeTotalText })
  const [over, inPrizes] = prizeText.split(prizeTotalText)

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-cta">
        <CardBody>
          <Heading color="contrast" scale="lg">
            {t('Lottery')} V2
          </Heading>
          <PrizeText color="#7645d9" fontSize="40px" bold lineHeight="1.1">
            {over}
          </PrizeText>
          {prizeInBusd.isNaN() ? (
            <>
              <Skeleton height={60} width={210} />
            </>
          ) : (
            <Balance fontSize="40px" color="#7645d9" bold lineHeight="1.1" prefix="$" decimals={0} value={prizeTotal} />
          )}
          <Flex justifyContent="space-between">
            <PrizeText color="contrast" fontSize="28px" bold lineHeight="1.1">
              {inPrizes}
            </PrizeText>
            <ArrowForwardIcon mt={30} color="primary" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default LotteryPromotionCard
