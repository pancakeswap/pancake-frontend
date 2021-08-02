import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, ArrowForwardIcon, Link, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const NowLive = styled(Text)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 24px;
  font-weight: 600;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Wrapper = styled.div`
  border-radius: 32px;
  width: 100%;
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;
`

const Inner = styled(Flex)`
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  max-height: 220px;
`

const LeftWrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`

const RightWrapper = styled(Flex)`
  align-items: center;
  justify-content: flex-end;
  & img {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & img {
      display: flex;
      height: 100%;
      width: auto;
    }
  }
`

const LotteryBanner = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Inner>
        <LeftWrapper>
          <NowLive>{t('20 Contenders...')}</NowLive>
          <Heading scale="xxl" mb="16px" color="#ffffff">
            {t('5 Winners')}
          </Heading>
          <Link href="/farms/auction">
            <Button>
              <Text color="white" bold fontSize="16px" mr="4px">
                {t('Farm Auctions')}
              </Text>
              <ArrowForwardIcon color="white" />
            </Button>
          </Link>
        </LeftWrapper>
        <RightWrapper>
          <img src="/images/decorations/auction-bunny.png" alt="auction bunny" />
        </RightWrapper>
      </Inner>
    </Wrapper>
  )
}

export default LotteryBanner
