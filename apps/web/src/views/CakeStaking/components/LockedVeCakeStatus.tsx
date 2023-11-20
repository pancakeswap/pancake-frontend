import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Link,
  Message,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import { formatBigInt, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCakePrice } from 'hooks/useCakePrice'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { formatTime } from 'utils/formatTime'
import { CakeLockStatus } from 'views/CakeStaking/types'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { useWriteMigrateCallback } from '../hooks/useContractWrite/useWriteMigrateCallback'

dayjs.extend(relativeTime)

export const LockedVeCakeStatus: React.FC<{
  status: CakeLockStatus
}> = ({ status }) => {
  const { balance } = useVeCakeBalance()
  if (status === CakeLockStatus.NotLocked) return null

  return (
    <Box maxWidth={['100%', '369px']}>
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">My VeCAKE</Heading>
              <Balance
                fontSize="20px"
                bold
                color={balance.eq(0) ? 'failure' : 'secondary'}
                value={getBalanceNumber(balance)}
                decimals={2}
              />
            </AutoColumn>
            <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
          </RowBetween>
        </CardHeader>
        <LockedInfo />
      </Card>
    </Box>
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
  const cakePrice = useCakePrice()
  const migrate = useWriteMigrateCallback()
  const { cakeLockedAmount, cakeUnlockTime, shouldMigrate, cakePoolLockExpired } = useCakeLockStatus()
  const cakeLocked = useMemo(() => Number(formatBigInt(cakeLockedAmount, 18)), [cakeLockedAmount])
  const cakeLockedUsdValue: number = useMemo(() => {
    return cakePrice.times(cakeLocked).toNumber()
  }, [cakePrice, cakeLocked])

  const unlocked = cakeUnlockTime > 0 && dayjs().isAfter(dayjs.unix(cakeUnlockTime))
  const unlockTimeToNow = cakeUnlockTime ? dayjs.unix(cakeUnlockTime).fromNow(true) : ''

  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      {shouldMigrate ? (
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

            {cakeUnlockTime ? (
              <Text fontSize={12} color={unlocked ? CUSTOM_WARNING_COLOR : undefined}>
                {t('on')} {formatTime(Number(dayjs.unix(cakeUnlockTime)))}
              </Text>
            ) : null}
          </AutoColumn>
        </RowBetween>
        {shouldMigrate ? (
          <Button width="100%" onClick={migrate}>
            {t('Migrate to veCAKE')}
          </Button>
        ) : null}
      </StyledLockedCard>
      {cakePoolLockExpired ? (
        <>
          <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
            <AutoColumn gap="8px">
              <Text as="p">
                {t(
                  'Position migrated from CAKE Pool can not be extended or topped up. To extend or add more CAKE, set up a native veCAKE position.',
                )}
              </Text>
              <Link href="https://@todo" color="text">
                {t('Learn More >>')}
              </Link>
            </AutoColumn>
          </Message>
          <Link external style={{ textDecoration: 'none', width: '100%' }} href="https://@todo">
            <Button width="100%" variant="secondary">
              {t('View CAKE Pool Position')}
            </Button>
          </Link>
        </>
      ) : null}
      {unlocked ? (
        <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
          <Text as="p" color={CUSTOM_WARNING_COLOR}>
            {t(
              'Renew your veCAKE position to continue enjoying the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
            )}
          </Text>
        </Message>
      ) : null}
      {shouldMigrate ? (
        <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
          <Text as="p" color={CUSTOM_WARNING_COLOR}>
            {t(
              'Migrate your CAKE staking position to veCAKE and enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
            )}
          </Text>
        </Message>
      ) : null}
      {!unlocked && !shouldMigrate ? (
        <Flex justifyContent="center">
          <img src="/images/cake-staking/my-cake-bunny.png" alt="my-cake-bunny" width="254px" />
        </Flex>
      ) : null}
    </FlexGap>
  )
}
