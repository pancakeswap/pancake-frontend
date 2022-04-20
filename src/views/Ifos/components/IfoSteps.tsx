import styled from 'styled-components'
import every from 'lodash/every'
import {
  Stepper,
  Step,
  StepStatus,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Box,
  CheckmarkIcon,
  Flex,
  useTooltip,
  TooltipText,
  Link,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from 'components/NextLink'
import { useWeb3React } from '@web3-react/core'

import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { useProfile } from 'state/profile/hooks'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import ConnectWalletButton from 'components/ConnectWalletButton'

interface TypeProps {
  ifoCurrencyAddress: string
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

const Wrapper = styled(Container)`
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

const Step1 = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <span>
        {t(
          'IFO credit is calculated by average block balance in the IFO pool in over the staking period announced with each IFO proposal.',
        )}
      </span>{' '}
      <InlineLink
        external
        href="https://medium.com/pancakeswap/initial-farm-offering-ifo-3-0-ifo-staking-pool-622d8bd356f1"
      >
        {t('Please refer to our blog post for more details.')}
      </InlineLink>
    </Box>,
    {},
  )

  return (
    <CardBody>
      {tooltipVisible && tooltip}
      <Heading as="h4" color="secondary" mb="16px">
        {t('Stake CAKE in IFO pool')}
      </Heading>
      <Box>
        <Text color="textSubtle" small>
          {t(
            'The maximum amount of CAKE user can commit to the Public Sale, is equal to the average CAKE balance in the IFO CAKE pool prior to the IFO. Stake more CAKE to increase the maximum CAKE you can commit to the sale. Missed this IFO? You can keep staking in the IFO CAKE Pool to join the next IFO sale.',
          )}
        </Text>
        <TooltipText as="span" fontWeight={700} ref={targetRef} color="textSubtle" small>
          {t('How does the IFO credit calculated?')}
        </TooltipText>
      </Box>
    </CardBody>
  )
}

const Step2 = () => {
  const { t } = useTranslation()
  return (
    <CardBody>
      <Heading as="h4" color="secondary" mb="16px">
        {t('Commit CAKE')}
      </Heading>
      <Text color="textSubtle" small>
        {t('When the IFO sales are live, you can “commit” your CAKE to buy the tokens being sold.')} <br />
      </Text>
    </CardBody>
  )
}

const IfoSteps: React.FC<TypeProps> = () => {
  const { hasActiveProfile } = useProfile()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const stepsValidationStatus = [hasActiveProfile, false, false, false]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    const renderAccountStatus = () => {
      if (!account) {
        return <ConnectWalletButton />
      }

      if (isStepValid) {
        return (
          <Flex alignItems="center">
            <Text color="success" bold mr="8px">
              {t('Profile Active!')}
            </Text>
            <CheckmarkIcon color="success" />
          </Flex>
        )
      }

      return (
        <Button as={RouterLink} to={`${nftsBaseUrl}/profile/${account.toLowerCase()}`}>
          {t('Activate your Profile')}
        </Button>
      )
    }

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Activate your Profile')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('You’ll need an active PancakeSwap Profile to take part in an IFO!')}
            </Text>
            {renderAccountStatus()}
          </CardBody>
        )
      case 1:
        return <Step1 />
      case 2:
        return <Step2 />
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Claim your tokens and achievement')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent CAKE tokens will be returned to your wallet.',
              )}
            </Text>
          </CardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading id="ifo-how-to" as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {t('How to Take Part in the Public Sale')}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((_, index) => (
          <Step
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            statusFirstPart={getStatusProp(index)}
            statusSecondPart={getStatusProp(index + 1)}
          >
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
