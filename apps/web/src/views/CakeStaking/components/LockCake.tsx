import { useTranslation } from '@pancakeswap/localization'
import {
  AtomBox,
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  ErrorIcon,
  Flex,
  FlexGap,
  Grid,
  Heading,
  InfoFilledIcon,
  Message,
  Row,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import styled from 'styled-components'
import { formatTime } from 'utils/formatTime'

dayjs.extend(relativeTime)

export enum StatingStatus {
  NotStaking = 'NotStaking',
  Staking = 'Staking',
  Expired = 'Expired',
  Migrate = 'Migrate',
}

const MyVeCakeCard = () => {
  // @todo @ChefJerry useHook
  // const balance = 1253.48
  const balance = 0

  return (
    <Card isActive>
      <CardHeader>
        <RowBetween>
          <AutoColumn>
            <Heading color="text">My VeCAKE</Heading>
            <Balance
              fontSize="20px"
              bold
              color={balance < 0.01 ? 'failure' : 'secondary'}
              value={balance}
              decimals={2}
            />
          </AutoColumn>
          <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
        </RowBetween>
      </CardHeader>
      <LockedInfo />
    </Card>
  )
}

export const StyledLockedCard = styled(AutoColumn)`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const CUSTOM_WARNING_COLOR = '#D67E0A'

const LockedInfo = () => {
  const { t } = useTranslation()

  const cakePriceBusd = useCakePrice()
  // @todo @ChefJerry useHook
  const cakeLocked = 1557.75

  const cakeLockedUsdValue = useMemo(() => {
    return new BigNumber(cakeLocked).times(cakePriceBusd).toNumber()
  }, [cakePriceBusd, cakeLocked])

  const needMigrate = true
  const unlockTime = dayjs().add(2, 'weeks')
  const unlocked = dayjs().isBefore(unlockTime)
  const unlockTimeToNow = dayjs(unlockTime).fromNow(true)

  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      {needMigrate ? (
        <RowBetween>
          <Text color="textSubtle" bold fontSize={12} textTransform="uppercase">
            {t('my cake staking')}
          </Text>
          <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
            {t('Migration Needed')}
          </Tag>
        </RowBetween>
      ) : null}
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('cake locked')}
            </Text>
            <Balance value={cakeLocked} decimals={2} fontWeight={600} fontSize={20} />
            <Balance prefix="~" value={cakeLockedUsdValue} decimals={2} unit="USD" fontSize={12} />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            {unlocked ? (
              <Text fontWeight={600} fontSize={20} color={CUSTOM_WARNING_COLOR}>
                {t('Unlocked')}
              </Text>
            ) : (
              <Text fontWeight={600} fontSize={20}>
                {unlockTimeToNow}
              </Text>
            )}
            <Text fontSize={12} color={unlocked ? CUSTOM_WARNING_COLOR : undefined}>
              {t('on')} {formatTime(Number(unlockTime))}
            </Text>
          </AutoColumn>
        </RowBetween>
        <Button width="100%">{t('Migrate to veCAKE')}</Button>
      </StyledLockedCard>
      {unlocked ? (
        <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
          <Text as="p" color={CUSTOM_WARNING_COLOR}>
            {t(
              'Renew your veCAKE position to continue enjoying the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
            )}
          </Text>
        </Message>
      ) : (
        <Flex justifyContent="center">
          <img src="/images/cake-staking/my-cake-bunny.png" alt="my-cake-bunny" width="254px" />
        </Flex>
      )}
    </FlexGap>
  )
}

export const LockCake = () => {
  return (
    <Grid gridGap="24px" gridTemplateColumns="1fr 2fr">
      <MyVeCakeCard />
      <MyVeCakeCard />
    </Grid>
  )
}
