import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { YourScoreProps } from '../../types'
import CardUserInfo from './CardUserInfo'

const StyledCard = styled(Card)`
  min-width: 380px;
`

const ScoreCard: React.FC<YourScoreProps> = ({ hasRegistered, account, profile, isLoading }) => {
  return (
    <StyledCard mt="24px">
      <CardBody>
        {isLoading ? (
          <Skeleton width="100%" height="60px" />
        ) : (
          <>
            <CardUserInfo hasRegistered={hasRegistered} account={account} profile={profile} />
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
