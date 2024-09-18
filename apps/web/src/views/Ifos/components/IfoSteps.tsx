import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import {
  Balance,
  Box,
  Button,
  Card,
  CardBody,
  CheckmarkIcon,
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
} from '@pancakeswap/uikit'
import { Ifo, NextLinkFromReactRouter as RouterLink } from '@pancakeswap/widgets-internal'
import every from 'lodash/every'
import { ReactNode, useMemo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCakePrice } from 'hooks/useCakePrice'
import { useProfile } from 'state/profile/hooks'

import { Address } from 'viem'
import { useChainName } from '../hooks/useChainNames'

interface TypeProps {
  sourceChainIfoCredit?: CurrencyAmount<Currency>
  dstChainIfoCredit?: CurrencyAmount<Currency>
  srcChainId?: ChainId
  ifoChainId?: ChainId
  ifoCurrencyAddress: Address
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
  isFinished?: boolean
  isCrossChainIfo?: boolean
  hasBridged?: boolean
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

function ICakeCard({
  icon,
  title,
  credit,
  more,
  action,
}: {
  action?: ReactNode
  icon?: ReactNode
  title?: ReactNode
  credit?: CurrencyAmount<Currency>
  more?: ReactNode
}) {
  const balanceNumber = useMemo(() => credit && Number(credit.toExact()), [credit])

  return (
    <SmallStakePoolCard borderRadius="default" p="16px">
      <FlexGap justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="16px">
        <Flex>
          {icon}
          <Box ml="16px">
            <Text bold fontSize="12px" textTransform="uppercase" color="secondary">
              {title}
            </Text>
            <Balance fontSize="20px" bold decimals={5} value={balanceNumber ?? 0} />
            {more}
          </Box>
        </Flex>
        {action}
      </FlexGap>
    </SmallStakePoolCard>
  )
}

const Step1 = ({
  hasProfile,
  sourceChainIfoCredit,
  isCrossChainIfo,
}: {
  srcChainId?: ChainId
  hasProfile: boolean
  sourceChainIfoCredit?: CurrencyAmount<Currency>
  isCrossChainIfo?: boolean
}) => {
  const { t } = useTranslation()
  const cakePrice = useCakePrice()
  const balanceNumber = useMemo(
    () => sourceChainIfoCredit && Number(sourceChainIfoCredit.toExact()),
    [sourceChainIfoCredit],
  )
  const creditDollarValue = cakePrice.multipliedBy(balanceNumber ?? 1).toNumber()

  return (
    <CardBody>
      <Heading as="h4" color="secondary" mb="16px">
        {t('Lock CAKE in the BNB Chain CAKE Staking')}
      </Heading>
      <Box>
        <Text mb="4px" color="textSubtle" small>
          {t(
            'The maximum amount of CAKE you can commit to the Public Sale equals the number of your iCAKE, which is based on your veCAKE balance at the snapshot time of each IFO. Lock more CAKE for longer durations to increase the maximum CAKE you can commit to the sale.',
          )}
        </Text>
        <Link
          external
          fontWeight={700}
          color="textSubtle"
          small
          href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering/icake#how-is-icake-calculated"
        >
          {t('How is the number of iCAKE calculated?')}
        </Link>
        <Text mt="4px" color="textSubtle" small>
          {t('Missed this IFO? Lock CAKE today for the next IFO, while enjoying a wide range of veCAKE benefits!')}
        </Text>
      </Box>
      {hasProfile && (
        <ICakeCard
          icon={
            <Ifo.IfoSalesLogo
              size={66}
              hasICake={Boolean(sourceChainIfoCredit && sourceChainIfoCredit.quotient > 0n)}
            />
          }
          credit={sourceChainIfoCredit}
          title={t('Your ICAKE %iCakeSuffix%', { iCakeSuffix: isCrossChainIfo ? 'on BNB' : '' })}
          more={
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
          }
          action={
            <RouterLink to="/cake-staking">
              <Button>{t('View CAKE Staking')}</Button>
            </RouterLink>
          }
        />
      )}
    </CardBody>
  )
}

const Step2 = ({
  hasProfile,
  isLive,
  isCommitted,
  isCrossChainIfo,
}: {
  hasProfile: boolean
  isLive: boolean
  isCommitted: boolean
  isCrossChainIfo?: boolean
}) => {
  const { t } = useTranslation()
  return (
    <CardBody>
      <Heading as="h4" color="secondary" mb="1rem">
        {isCrossChainIfo ? t('Switch network and commit CAKE') : t('Commit CAKE')}
      </Heading>
      <Text color="textSubtle" small>
        {isCrossChainIfo
          ? t(
              'When the IFO sales are live, you can switch the network to the blockchain where the IFO is hosted on, click “commit” to commit CAKE and buy the tokens being sold.',
            )
          : t('When the IFO sales are live, you can click “commit” to commit CAKE and buy the tokens being sold.')}
      </Text>
      <Text color="textSubtle" small mt="1rem">
        {t('You will need a separate amount of CAKE in your wallet balance to commit to the IFO sales.')}
      </Text>
      {hasProfile && isLive && !isCommitted && (
        <Button as="a" href="#current-ifo" mt="1rem">
          {t('Commit CAKE')}
        </Button>
      )}
    </CardBody>
  )
}

const IfoSteps: React.FC<React.PropsWithChildren<TypeProps>> = ({
  dstChainIfoCredit,
  sourceChainIfoCredit,
  srcChainId,
  ifoChainId,
  isCommitted,
  hasClaimed,
  isLive,
  isFinished,
  isCrossChainIfo,
  hasBridged,
}) => {
  const { hasActiveProfile } = useProfile()
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const ifoChainName = useChainName(ifoChainId)
  const sourceChainHasICake = useMemo(
    () => sourceChainIfoCredit && sourceChainIfoCredit.quotient > 0n,
    [sourceChainIfoCredit],
  )
  const stepsValidationStatus = isCrossChainIfo
    ? [hasActiveProfile, sourceChainHasICake, hasBridged, isCommitted, hasClaimed]
    : [hasActiveProfile, sourceChainHasICake, isCommitted, hasClaimed]

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

    const renderCommitCakeStep = () => (
      <Step2
        hasProfile={hasActiveProfile}
        isLive={Boolean(isLive)}
        isCommitted={isCommitted}
        isCrossChainIfo={isCrossChainIfo}
      />
    )
    const renderClaimStep = () => (
      <CardBody>
        <Heading as="h4" color="secondary" mb="16px">
          {t('Claim your tokens')}
        </Heading>
        <Text color="textSubtle" small>
          {isCrossChainIfo
            ? t(
                'After the IFO sales finish, you can switch the network to the blockchain where the IFO is hosted on, claim any IFO tokens that you bought, and any unspent CAKE.',
              )
            : t('After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent CAKE.')}
        </Text>
      </CardBody>
    )
    const renderBridge = () => (
      <CardBody>
        <Heading as="h4" color="secondary" mb="16px">
          {t('Bridge iCAKE')}
        </Heading>
        <Text color="textSubtle" small>
          {t(
            'To participate in the cross chain Public Sale, you need to bridge your veCAKE to the blockchain where the IFO will be hosted on.',
          )}
        </Text>
        <Text color="textSubtle" small mt="1rem">
          {t(
            'Before or during the sale, you may bridge your veCAKE again if you’ve added more CAKE or extended your lock staking position.',
          )}
        </Text>
        {sourceChainHasICake && (
          <ICakeCard
            icon={<LogoRoundIcon style={{ alignSelf: 'flex-start' }} width={32} height={32} />}
            credit={dstChainIfoCredit}
            title={t('Your iCAKE on %chainName%', { chainName: ifoChainName })}
            action={
              !isStepValid && !isFinished ? (
                <Button as="a" href="#sync-vecake">
                  {t('Bridge iCAKE')}
                </Button>
              ) : null
            }
          />
        )}
      </CardBody>
    )

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Activate your Profile on BNB Chain')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {isCrossChainIfo
                ? t('You’ll need an active PancakeSwap Profile to take part in the IFO’s Public Sale!')
                : t('You’ll need an active PancakeSwap Profile to take part in an IFO!')}
            </Text>
            {renderAccountStatus()}
          </CardBody>
        )
      case 1:
        return (
          <Step1
            hasProfile={hasActiveProfile}
            sourceChainIfoCredit={sourceChainIfoCredit}
            srcChainId={srcChainId}
            isCrossChainIfo={isCrossChainIfo}
          />
        )
      case 2:
        if (isCrossChainIfo) {
          return renderBridge()
        }
        return renderCommitCakeStep()
      case 3:
        if (isCrossChainIfo) {
          return renderCommitCakeStep()
        }
        return renderClaimStep()
      case 4:
        return renderClaimStep()
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
