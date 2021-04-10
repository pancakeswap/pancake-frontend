import React from 'react'
import styled from 'styled-components'
import { Stepper, Step, StepStatus, Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import { useProfile } from 'state/hooks'
import { useTokenBalance } from 'hooks/useTokenBalance'
import Container from 'components/layout/Container'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

interface Props {
  currency: Token
}

const Wrapper = styled(Container)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const IfoSteps: React.FC<Props> = ({ currency }) => {
  const { hasProfile } = useProfile()
  const balance = useTokenBalance(getAddress(currency.address))

  const hasStepBeenValidated = [hasProfile, balance.isGreaterThan(0), false, false]
  const getStatus = (step: number): StepStatus => {
    return hasStepBeenValidated[step] ? 'past' : 'future'
  }

  return (
    <Wrapper>
      <Heading as="h2" size="xl" color="secondary" mb="24px" textAlign="center">
        How to Take Part
      </Heading>
      <Stepper>
        <Step index={0} status={getStatus(0)}>
          <Card>
            <CardBody>
              <Heading as="h4" color="secondary" mb="16px">
                Activate your Profile
              </Heading>
              <Text color="textSubtle">You’ll need an active PancakeSwap Profile to take part in an IFO!</Text>
            </CardBody>
          </Card>
        </Step>
        <Step index={1} status={getStatus(1)}>
          <Card>
            <CardBody>
              <Heading as="h4" color="secondary" mb="16px">
                Get CAKE-BNB LP Tokens
              </Heading>
              <Text color="textSubtle">
                Stake CAKE and BNB in the liquidity pool to get LP tokens. You’ll spend them to buy IFO sale tokens.
              </Text>
            </CardBody>
          </Card>
        </Step>
        <Step index={2} status={getStatus(2)}>
          <Card>
            <CardBody>
              <Heading as="h4" color="secondary" mb="16px">
                Commit LP Tokens
              </Heading>
              <Text color="textSubtle">
                When the IFO sales are live, you can “commit” your LP tokens to buy the tokens being sold. We recommend
                committing to the Basic Sale first, but you can do both if you want.
              </Text>
            </CardBody>
          </Card>
        </Step>
        <Step index={3} status={getStatus(3)}>
          <Card>
            <CardBody>
              <Heading as="h4" color="secondary" mb="16px">
                Claim your tokens and achievement
              </Heading>
              <Text color="textSubtle">
                After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent CAKE-BNB LP
                tokens will be returned to your wallet.
              </Text>
            </CardBody>
          </Card>
        </Step>
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
