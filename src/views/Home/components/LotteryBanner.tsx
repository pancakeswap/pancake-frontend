import React from 'react'
import styled from 'styled-components'
import { Heading, Text, Flex, Button, ArrowForwardIcon, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import { NavLink } from 'react-router-dom'
import Balance from 'components/Balance'

const Title = styled(Heading).attrs({ as: 'h1', scale: 'xl' })`
  color: #ffffff;
  margin-bottom: 16px;
  display: inline;
`

const NowLive = styled(Text)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 24px;
  font-weight: 600;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Wrapper = styled.div`
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 256px;
  }
`

const Inner = styled(Container)`
  display: flex;
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const LeftWrapper = styled.div`
  flex: 1;
  padding-right: 0;
  padding-bottom: 40px;
  padding-top: 40px;
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0.5;
  padding-left: 0;

  & img {
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0.6;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & img {
      margin-top: -25px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex: 0.8;
  }
`

const LotteryBanner: React.FC<{ totalPrize: number; observerRef: React.MutableRefObject<HTMLDivElement> }> = ({
  totalPrize,
  observerRef,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Inner>
        <LeftWrapper>
          <NowLive>{t('Lottery Now Live')}</NowLive>
          <Flex flexDirection={['column', 'row']}>
            <Flex alignItems="flex-end">
              <Title mr="8px">{t('Over')}</Title>
              {!totalPrize ? (
                <>
                  <div ref={observerRef} />
                  <Skeleton height={40} my={20} width={170} />
                </>
              ) : (
                <Balance
                  display="inline"
                  mb="8px"
                  fontSize="40px"
                  color="#ffffff"
                  bold
                  prefix="$"
                  decimals={0}
                  value={totalPrize}
                />
              )}
            </Flex>
            <Flex alignItems="flex-end">
              <Title ml={[null, '8px']}>{t('in Prizes')}</Title>
            </Flex>
          </Flex>
          <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-banner">
            <Button>
              <Text color="white" bold fontSize="16px" mr="4px">
                {t('Play Now')}
              </Text>
              <ArrowForwardIcon color="white" />
            </Button>
          </NavLink>
        </LeftWrapper>
        <RightWrapper>
          <img src="/images/tombola.png" alt="lottery bunny" />
        </RightWrapper>
      </Inner>
    </Wrapper>
  )
}

export default LotteryBanner
