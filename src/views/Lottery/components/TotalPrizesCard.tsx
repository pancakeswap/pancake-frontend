import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Text, PancakeRoundIcon } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { useAllReward } from 'hooks/useReward'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'

const CardHeading = styled.div`
  display: flex;
  margin-bottom: 24px;
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

const Block = styled.div`
  margin-bottom: 16px;
`

const Value = styled.div`
  margin-bottom: 8px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const { account } = useWallet()
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <CardHeading>
          <IconWrapper>
            <PancakeRoundIcon />
          </IconWrapper>
          <PrizeCountWrapper>
            <Text fontSize="14px" color="textSubtle">
              Total Prizes:
            </Text>
            <Heading size="lg">100,000 {TranslateString(0, 'CAKE')}</Heading>
          </PrizeCountWrapper>
        </CardHeading>
        <Block>
          <Value>200</Value>
          <Text>{TranslateString(999, 'CAKE to Harvest')}</Text>
        </Block>
        <Actions>{account ? <span>Account</span> : <UnlockButton fullWidth />}</Actions>
      </CardBody>
    </Card>
  )
}

export default FarmedStakingCard
