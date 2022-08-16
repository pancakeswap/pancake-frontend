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
  LogoRoundIcon,
  Skeleton,
  Link,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from 'components/NextLink'
import { useWeb3React } from '@pancakeswap/wagmi'

import { useTranslation } from '@pancakeswap/localization'
import useTokenBalance from 'hooks/useTokenBalance'
import Container from 'components/Layout/Container'
import { useProfile } from 'state/profile/hooks'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useIfoCredit, useIfoCeiling } from 'state/pools/hooks'
import { getICakeWeekDisplay } from 'views/Pools/helpers'

interface TypeProps {
  ifoCurrencyAddress: string
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

const SmallStakePoolCard = styled(Box)`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

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

const Step1 = ({ hasProfile }: { hasProfile: boolean }) => {
  const { t } = useTranslation()
  const credit = useIfoCredit()
  const ceiling = useIfoCeiling()
  const creditDollarValue = useBUSDCakeAmount(getBalanceNumber(credit))
  const weeksDisplay = getICakeWeekDisplay(ceiling)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t(
          'The number of iCAKE equals the locked staking amount if the staking duration is longer than %weeks% weeks. If the staking duration is less than %weeks% weeks, it will linearly decrease based on the staking duration.',
          {
            weeks: weeksDisplay,
          },
        )}
      </Text>
      <InlineLink external href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering/icake">
        {t('Learn more about iCAKE')}
      </InlineLink>
    </Box>,
    {},
  )

  return (
    <CardBody>
      {tooltipVisible && tooltip}
      <Heading as="h4" color="secondary" mb="16px">
        {t('Lock CAKE in the CAKE pool')}
      </Heading>
      <Box>
        <Text mb="4px" color="textSubtle" small>
          {t(
            'The maximum amount of CAKE you can commit to the Public Sale equals the number of your iCAKE. Lock more CAKE for longer durations to increase the maximum CAKE you can commit to the sale.',
          )}
        </Text>
        <TooltipText as="span" fontWeight={700} ref={targetRef} color="textSubtle" small>
          {t('How does the number of iCAKE calculated?')}
        </TooltipText>
        <Text mt="4px" color="textSubtle" small>
          {t(
            'Missed this IFO? You will enjoy the same amount of iCAKE for future IFOs if your locked-staking position is not unlocked.',
          )}
        </Text>
      </Box>
      {hasProfile && (
        <SmallStakePoolCard borderRadius="default" p="16px">
          <FlexGap justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="16px">
            <Flex>
              <LogoRoundIcon style={{ alignSelf: 'flex-start' }} width={32} height={32} />
              <Box ml="16px">
                <Text bold fontSize="12px" textTransform="uppercase" color="secondary">
                  {t('Your max CAKE entry')}
                </Text>
                <Balance fontSize="20px" bold decimals={5} value={getBalanceNumber(credit)} />
                <Text fontSize="12px" color="textSubtle">
                  {creditDollarValue !== undefined ? (
                    <Balance
                      value={creditDollarValue}
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      unit=" USD"
                    />
                  ) : (
                    <Skeleton mt="1px" height={16} width={64} />
                  )}
                </Text>
              </Box>
            </Flex>
          </FlexGap>
        </SmallStakePoolCard>
      )}
    </CardBody>
  )
}

const Step2 = ({ hasProfile, isLive, isCommitted }: { hasProfile: boolean; isLive: boolean; isCommitted: boolean }) => {
  const { t } = useTranslation()
  return (
    <CardBody>
      <Heading as="h4" color="secondary" mb="16px">
        {t('Commit CAKE')}
      </Heading>
      <Text color="textSubtle" small>
        {t(
          'Please note that CAKE in the fixed-term staking positions will remain locked and can not be used for committing to IFO sales. You will need a separate amount of CAKE in your wallet balance to commit to the IFO sales.',
        )}{' '}
        <br />
      </Text>
      {hasProfile && isLive && !isCommitted && (
        <Button as="a" href="#current-ifo" mt="16px">
          {t('Commit CAKE')}
        </Button>
      )}
    </CardBody>
  )
}

const IfoSteps: React.FC<React.PropsWithChildren<TypeProps>> = ({
  isCommitted,
  hasClaimed,
  isLive,
  ifoCurrencyAddress,
}) => {
  const { hasActiveProfile } = useProfile()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { balance } = useTokenBalance(ifoCurrencyAddress)
  const stepsValidationStatus = [hasActiveProfile, balance.isGreaterThan(0), isCommitted, hasClaimed]

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
        <Button as={RouterLink} to={`/profile/${account.toLowerCase()}`}>
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
        return <Step1 hasProfile={hasActiveProfile} />
      case 2:
        return <Step2 hasProfile={hasActiveProfile} isLive={isLive} isCommitted={isCommitted} />
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
