import React from 'react'
import { Card, CardBody, Flex } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { YourScoreProps } from '../../types'
import CardUserInfo from './CardUserInfo'

const ScoreCard: React.FC<YourScoreProps> = ({ hasRegistered, account, profile }) => {
  return (
    <Card>
      <CardBody>
        <CardUserInfo hasRegistered={hasRegistered} account={account} profile={profile} />
        {!account && (
          <Flex mt="24px" justifyContent="center">
            <UnlockButton />
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}

export default ScoreCard
