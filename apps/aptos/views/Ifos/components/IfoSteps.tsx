import styled from 'styled-components'
import every from 'lodash/every'
import {
  Balance,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FlexGap,
  Heading,
  Link,
  LogoRoundIcon,
  Skeleton,
  Step,
  StepStatus,
  Stepper,
  Text,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

// import useTokenBalance from 'hooks/useTokenBalance'
import { useStableCakeAmount } from 'hooks/useStablePrice'
// import { useIfoCredit, useIfoCeiling } from 'state/pools/hooks'
// import { getICakeWeekDisplay } from 'views/Pools/helpers'

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

const Step1 = () => {
  const { t } = useTranslation()
  // const credit = useIfoCredit()
  // const ceiling = useIfoCeiling()
  // const creditDollarValue = useBUSDCakeAmount(getBalanceNumber(credit))
  // const weeksDisplay = getICakeWeekDisplay(ceiling)
  const credit = BIG_ZERO
  const ceiling = BIG_ZERO
  const creditDollarValue = useStableCakeAmount(getBalanceNumber(credit))
  const weeksDisplay = 0

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
    </CardBody>
  )
}

const Step2 = ({ isLive, isCommitted }: { isLive: boolean; isCommitted: boolean }) => {
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
      {isLive && !isCommitted && (
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
  // const { account } = useWeb3React()
  const { account } = { account: 'TODO: Aptos' }
  const { t } = useTranslation()
  // const { balance } = useTokenBalance(ifoCurrencyAddress)
  const { balance } = { balance: BIG_ZERO }
  const stepsValidationStatus = [balance.isGreaterThan(0), isCommitted, hasClaimed]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    switch (step) {
      case 0:
        return <Step1 />
      case 1:
        return <Step2 isLive={!!isLive} isCommitted={isCommitted} />
      case 2:
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
