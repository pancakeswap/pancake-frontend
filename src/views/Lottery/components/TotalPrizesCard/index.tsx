import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Text, PancakeRoundIcon } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import PrizeGrid from './PrizeGrid'

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
        <PrizeGrid />
      </CardBody>
    </Card>
  )
}

export default FarmedStakingCard
