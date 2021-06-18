import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Button, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledLotteryCard = styled(Card)`
  background-image: url('/images/tombola.png');
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: 70%;
  min-height: 376px;
`

const StyledHeadingText = styled(Text)`
  font-size: 24px;
  line-height: 1.1;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const StyledText = styled(Text)`
  font-size: 40px;
  line-height: 1.1;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 50px;
  }
`

const LotteryCard = () => {
  const { t } = useTranslation()

  return (
    <StyledLotteryCard>
      <CardBody>
        <StyledHeadingText bold mb="24px">
          PancakeSwap {t('Lottery')} V2
        </StyledHeadingText>
        <StyledText bold mb="24px" color="#7645d9">
          {t('Coming Soon...')}
        </StyledText>
        <Link external href="https://pancakeswap.medium.com/pancakeswap-april-may-recap-a4e7cf990f72">
          <Button px={['14px', null, null, null, '20px']}>
            <Text color="backgroundAlt" bold fontSize="16px">
              {t('Learn More')}
            </Text>
          </Button>
        </Link>
      </CardBody>
    </StyledLotteryCard>
  )
}

export default LotteryCard
