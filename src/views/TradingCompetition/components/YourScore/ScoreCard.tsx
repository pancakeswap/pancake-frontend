import React from 'react'
import styled from 'styled-components'
import { Card, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'
import CardUserInfo from './CardUserInfo'

const ScoreCard: React.FC<YourScoreProps> = ({ registered, account, profile }) => {
  return (
    <Card>
      <CardBody>
        <CardUserInfo registered={registered} account={account} profile={profile} />
      </CardBody>
    </Card>
  )
}

export default ScoreCard
