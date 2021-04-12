import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { YourScoreProps } from '../../types'
import CardUserInfo from './CardUserInfo'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const ScoreCard: React.FC<YourScoreProps> = ({
  hasRegistered,
  account,
  profile,
  isLoading,
  userLeaderboardInformation,
  currentPhase,
}) => {
  return (
    <StyledCard mt="24px">
      <CardBody>
        {isLoading ? (
          <Flex mt="24px" justifyContent="center" alignItems="center">
            <Skeleton width="100%" height="60px" />
          </Flex>
        ) : (
          <>
            <CardUserInfo
              hasRegistered={hasRegistered}
              account={account}
              profile={profile}
              userLeaderboardInformation={userLeaderboardInformation}
              currentPhase={currentPhase}
            />
            {!account && (
              <Flex mt="24px" justifyContent="center">
                <UnlockButton />
              </Flex>
            )}
          </>
        )}
      </CardBody>
    </StyledCard>
  )
}

export default ScoreCard
