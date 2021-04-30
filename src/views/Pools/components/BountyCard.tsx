import React from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from '@pancakeswap-libs/uikit'
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
  const TooltipComponent = () => (
    <Box>
      <Box mb="16px">
        {`${TranslateString(999, `This bounty is given as a reward for providing a service to other users.`)}`}
      </Box>
      <Box mb="16px">
        {TranslateString(
          999,
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto CAKE Pool’s compounding function for everyone.',
        )}
      </Box>
      <Box style={{ fontWeight: 'bold' }}>
        {TranslateString(999, `Auto-Compound Bounty: ${callFee / 100}% of all Auto CAKE pool users’ pending yield`)}
      </Box>
    </Box>
  )
  const { callFee } = useGetVaultFees()
  const [onPresentBountyModal] = useModal(
    <BountyModal
      cakeCallBountyToDisplay={cakeCallBountyToDisplay}
      dollarCallBountyToDisplay={dollarCallBountyToDisplay}
      totalPendingCakeRewards={totalPendingCakeRewards}
      callFee={callFee}
      TooltipComponent={TooltipComponent}
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, 'bottom-end')

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color="textSubtle" mr="4px">
                {TranslateString(999, 'Auto CAKE Bounty')}
              </Text>
              <Box ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </Box>
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
    </>
  )
}

export default BountyCard
