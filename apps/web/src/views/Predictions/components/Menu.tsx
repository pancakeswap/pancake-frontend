import { chainNames } from '@pancakeswap/chains'
import { PredictionStatus } from '@pancakeswap/prediction'
import { Button, Flex, HelpIcon, PrizeIcon } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useGetPredictionsStatus } from 'state/predictions/hooks'
import { styled } from 'styled-components'
import { TokenSelector } from 'views/Predictions/components/TokenSelector'
import FlexRow from './FlexRow'
import HistoryButton from './HistoryButton'
import { TimerLabel } from './Label'
import PrevNextNav from './PrevNextNav'

const SetCol = styled.div`
  position: relative;
  flex: none;
  width: 170px;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 270px;
  }
`

const HelpButtonWrapper = styled.div`
  order: 1;
  margin: 0 2px 0 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 2;
    margin: 0 0 0 8px;
  }
`

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 1;
    width: auto;
  }
`

const LeaderboardButtonWrapper = styled.div`
  display: block;

  order: 2;
  margin: 0 8px 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 3;
    margin: 0 0 0 8px;
  }
`

const ButtonWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    margin-left: 8px;
  }
`

const Menu = () => {
  const { query } = useRouter()
  const { chainId } = useActiveChainId()
  const status = useGetPredictionsStatus()

  const leaderboardUrl = useMemo(() => {
    return chainId ? `/prediction/leaderboard?chain=${chainNames[chainId]}&token=${query.token}` : ''
  }, [chainId, query.token])

  return (
    <FlexRow alignItems="center" p="16px" width="100%">
      <SetCol>
        <TokenSelector />
      </SetCol>
      {status === PredictionStatus.LIVE && (
        <>
          <FlexRow justifyContent="center">
            <PrevNextNav />
          </FlexRow>
          <SetCol>
            <Flex alignItems="center" justifyContent="flex-end">
              <TimerLabelWrapper>
                <TimerLabel />
              </TimerLabelWrapper>
              <HelpButtonWrapper>
                <Button
                  variant="subtle"
                  as="a"
                  href="https://docs.pancakeswap.finance/products/prediction"
                  target="_blank"
                  rel="noreferrer noopener"
                  width="48px"
                >
                  <HelpIcon width="24px" color="white" />
                </Button>
              </HelpButtonWrapper>
              <LeaderboardButtonWrapper>
                <Link href={leaderboardUrl} passHref>
                  <Button variant="subtle" width="48px">
                    <PrizeIcon color="white" />
                  </Button>
                </Link>
              </LeaderboardButtonWrapper>
              <ButtonWrapper style={{ order: 4 }}>
                <HistoryButton />
              </ButtonWrapper>
            </Flex>
          </SetCol>
        </>
      )}
    </FlexRow>
  )
}

export default Menu
