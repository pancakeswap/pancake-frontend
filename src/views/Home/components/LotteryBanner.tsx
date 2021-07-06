import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, ArrowForwardIcon, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { NavLink } from 'react-router-dom'
import Balance from 'components/Balance'
import { usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'

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
  ${({ theme }) => theme.mediaQueries.md} {
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

const LeftWrapper = styled(Flex)`
  flex-direction: column;
  flex: 1;
  padding-bottom: 40px;
  padding-top: 40px;
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0.5;

  & img {
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0.8;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & img {
      margin-top: -25px;
    }
  }
`

const LotteryBanner: React.FC<{ currentLotteryPrize: string }> = ({ currentLotteryPrize }) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = cakePriceBusd.times(currentLotteryPrize)
  const prizeTotal = getBalanceNumber(prizeInBusd)

  return (
    <Wrapper>
      <Inner>
        <LeftWrapper>
          <NowLive>{t('Lottery Now Live')}</NowLive>
          <>
            {prizeInBusd.isNaN() ? (
              <>
                <Skeleton height={40} mb={20} mt={10} width={280} />
              </>
            ) : (
              <Balance
                display="inline"
                mb="8px"
                fontSize="40px"
                color="#ffffff"
                bold
                prefix={`${t('Over')} $`}
                unit={` ${t('in Prizes!')}`}
                decimals={0}
                value={prizeTotal}
              />
            )}
          </>
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
          <img src="/images/lottery/tombola.png" alt="lottery bunny" />
        </RightWrapper>
      </Inner>
    </Wrapper>
  )
}

export default LotteryBanner
