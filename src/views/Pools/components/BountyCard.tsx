import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Text, Flex, HelpIcon, Button, Heading, Skeleton, useModal } from '@pancakeswap-libs/uikit'
import { useGetApiPrice } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
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
  const cakeVaultContract = useCakeVaultContract()
  const { fastRefresh } = useRefresh()
  const [estimatedBountyReward, setEstimatedBountyReward] = useState(null)
  const [dollarBountyToDisplay, setDollarBountyToDisplay] = useState(null)
  const [cakeBountyToDisplay, setCakeBountyToDisplay] = useState(null)
  const [callFee, setCallFee] = useState(null)
  const [onPresentBountyModal] = useModal(
    <BountyModal
      estimatedBountyReward={estimatedBountyReward}
      cakeBountyToDisplay={cakeBountyToDisplay}
      dollarBountyToDisplay={dollarBountyToDisplay}
      callFee={callFee}
    />,
  )

  const stakingTokenPrice = useGetApiPrice(getCakeAddress())

  useEffect(() => {
    const calculateEstimateRewards = async () => {
      const estimatedRewards = await cakeVaultContract.methods.calculateEstimateRewards().call()
      setEstimatedBountyReward(new BigNumber(estimatedRewards))
    }
    calculateEstimateRewards()
  }, [cakeVaultContract, fastRefresh])

  useEffect(() => {
    const getCallFee = async () => {
      const contractCallFee = await cakeVaultContract.methods.callFee().call()
      setCallFee(contractCallFee)
    }
    getCallFee()
  }, [cakeVaultContract])

  useEffect(() => {
    if (estimatedBountyReward && stakingTokenPrice) {
      // Reduce decimals for production
      const estimatedDollars = getFullDisplayBalance(estimatedBountyReward.multipliedBy(stakingTokenPrice), 18, 4)
      // Reduce decimals for production
      const estimatedCake = getFullDisplayBalance(estimatedBountyReward, 18, 8)
      setDollarBountyToDisplay(estimatedDollars)
      setCakeBountyToDisplay(estimatedCake)
    }
  }, [stakingTokenPrice, estimatedBountyReward])

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
