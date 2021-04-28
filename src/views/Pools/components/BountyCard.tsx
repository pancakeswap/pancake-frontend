import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Text, Flex, HelpIcon, Button, Heading, Skeleton, useModal } from '@pancakeswap-libs/uikit'
import { useGetApiPrice } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import useRefresh from 'hooks/useRefresh'
import useGetVaultFees, { FeeFunctions } from 'hooks/cakeVault/useGetVaultFees'
import useGetVaultBountyInfo from 'hooks/cakeVault/useGetVaultBountyInfo'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const InlineText = styled(Text)`
  display: inline;
`

const BountyCard = () => {
  const TranslateString = useI18n()
  const { fastRefresh } = useRefresh()
  const { estimatedBountyReward, dollarBountyToDisplay, cakeBountyToDisplay } = useGetVaultBountyInfo(fastRefresh)
  const { callFee } = useGetVaultFees([FeeFunctions.callFee])
  const [onPresentBountyModal] = useModal(
    <BountyModal
      estimatedBountyReward={estimatedBountyReward}
      cakeBountyToDisplay={cakeBountyToDisplay}
      dollarBountyToDisplay={dollarBountyToDisplay}
      callFee={callFee}
    />,
  )

  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="12px">
            <Text fontSize="16px" bold color="textSubtle" mr="4px">
              {TranslateString(999, 'Auto CAKE Bounty')}
            </Text>
            <HelpIcon color="textSubtle" />
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column" mr="12px">
            <Heading>{cakeBountyToDisplay || <Skeleton height={20} width={96} mb="2px" />}</Heading>
            <InlineText fontSize="12px" color="textSubtle">
              {dollarBountyToDisplay ? `~ ${dollarBountyToDisplay} USD` : <Skeleton height={16} width={62} />}
            </InlineText>
          </Flex>
          <Button
            disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
            onClick={onPresentBountyModal}
            scale="sm"
          >
            {TranslateString(999, 'Claim')}
          </Button>
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BountyCard
