import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Text, PancakeRoundIcon } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { useAllReward } from 'hooks/useReward'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  padding-bottom: 24px;
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

const Divider = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  width: 100%;
`

const PrizeGrid = styled.div`
  padding-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
`

const RightAlignedText = styled(Text)`
  text-align: right;
`

const RightAlignedHeading = styled(Heading)`
  text-align: right;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const Value = styled.div`
  margin-bottom: 8px;
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
          <Divider />
        </CardHeading>
        <PrizeGrid>
          <Text fontSize="14px" color="textSubtle">
            No. Matched
          </Text>
          <RightAlignedText fontSize="14px" color="textSubtle">
            Win Chance
          </RightAlignedText>
          <RightAlignedText fontSize="14px" color="textSubtle">
            Prize Pot
          </RightAlignedText>
          <Heading size="md">4</Heading>
          <RightAlignedHeading size="md">0.001%</RightAlignedHeading>
          <RightAlignedHeading size="md">60,000</RightAlignedHeading>
        </PrizeGrid>
      </CardBody>
    </Card>
  )
}

export default FarmedStakingCard
