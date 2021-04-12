import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { useTotalRewards } from 'hooks/useTickets'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import ExpandableSectionButton from 'components/ExpandableSectionButton/ExpandableSectionButton'
import { BigNumber } from 'bignumber.js'
import { usePriceCakeBusd } from 'state/hooks'
import PrizeGrid from '../PrizeGrid'
import CardBusdValue from '../../../Home/components/CardBusdValue'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`

const Right = styled.div`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const Left = styled.div`
  display: flex;
`

const IconWrapper = styled.div`
  margin-right: 16px;
  svg {
    width: 48px;
    height: 48px;
  }
`

const PrizeCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ExpandingWrapper = styled.div<{ showFooter: boolean }>`
  height: ${(props) => (props.showFooter ? '100%' : '0px')};

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 100%;
  }
`

const TotalPrizesCard = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const [showFooter, setShowFooter] = useState(false)
  const lotteryPrizeAmount = +getBalanceNumber(useTotalRewards()).toFixed(0)
  const lotteryPrizeAmountBusd = new BigNumber(lotteryPrizeAmount).multipliedBy(usePriceCakeBusd()).toNumber()
  const lotteryPrizeWithCommaSeparators = lotteryPrizeAmount.toLocaleString()
  const { currentLotteryNumber } = useContext(PastLotteryDataContext)

  return (
    <Card>
      <CardBody>
        {account && (
          <Flex mb="16px" alignItems="center" justifyContent="space-between" style={{ height: '20px' }}>
            {currentLotteryNumber === 0 && <Skeleton height={20} width={56} />}
            {currentLotteryNumber > 0 && (
              <Text fontSize="12px" style={{ fontWeight: 600 }}>
                {TranslateString(720, `Round #${currentLotteryNumber}`, { num: currentLotteryNumber })}
              </Text>
            )}
          </Flex>
        )}
        <CardHeading>
          <Left>
            <IconWrapper>
              <PancakeRoundIcon />
            </IconWrapper>
            <PrizeCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {TranslateString(722, 'Total Pot:')}
              </Text>
              <Heading size="lg">{lotteryPrizeWithCommaSeparators} CAKE</Heading>
              {lotteryPrizeAmountBusd !== 0 && <CardBusdValue value={lotteryPrizeAmountBusd} />}
            </PrizeCountWrapper>
          </Left>
          <Right>
            <ExpandableSectionButton onClick={() => setShowFooter(!showFooter)} expanded={showFooter} />
          </Right>
        </CardHeading>
      </CardBody>
      <ExpandingWrapper showFooter={showFooter}>
        <CardFooter>
          <PrizeGrid lotteryPrizeAmount={lotteryPrizeAmount} />
        </CardFooter>
      </ExpandingWrapper>
    </Card>
  )
}

export default TotalPrizesCard
