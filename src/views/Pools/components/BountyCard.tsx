import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Flex, HelpIcon, Button, Heading, Skeleton, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useRefresh from 'hooks/useRefresh'
import useGetVaultFees from 'hooks/cakeVault/useGetVaultFees'
import useGetVaultBountyInfo from 'hooks/cakeVault/useGetVaultBountyInfo'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
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
  const { dollarCallBountyToDisplay, cakeCallBountyToDisplay, totalPendingCakeRewards } = useGetVaultBountyInfo(
    fastRefresh,
  )
  const { callFee } = useGetVaultFees()
  const [onPresentBountyModal] = useModal(
    <BountyModal
      cakeCallBountyToDisplay={cakeCallBountyToDisplay}
      dollarCallBountyToDisplay={dollarCallBountyToDisplay}
      totalPendingCakeRewards={totalPendingCakeRewards}
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
            <Heading>{cakeCallBountyToDisplay || <Skeleton height={20} width={96} mb="2px" />}</Heading>
            <InlineText fontSize="12px" color="textSubtle">
              {dollarCallBountyToDisplay ? `~ ${dollarCallBountyToDisplay} USD` : <Skeleton height={16} width={62} />}
            </InlineText>
          </Flex>
          <Button
            disabled={!dollarCallBountyToDisplay || !cakeCallBountyToDisplay || !callFee}
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
