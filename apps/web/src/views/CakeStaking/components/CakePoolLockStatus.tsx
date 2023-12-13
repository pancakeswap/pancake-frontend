import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Message,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { formatTime } from 'utils/formatTime'
import { useCakePoolLockInfo } from '../hooks/useCakePoolLockInfo'
import { useWriteMigrateCallback } from '../hooks/useContractWrite/useWriteMigrateCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { StyledLockedCard } from './styled'

export const CakePoolLockInfo = () => {
  const { t } = useTranslation()
  const { lockedAmount = 0n, lockEndTime = 0n } = useCakePoolLockInfo()
  const roundedEndTime = useMemo(() => {
    return Math.floor(Number(lockEndTime) / WEEK) * WEEK
  }, [lockEndTime])
  const cakePrice = useCakePrice()
  const cakeAmount = useMemo(() => Number(formatBigInt(lockedAmount)), [lockedAmount])
  const cakeAmountUsdValue = useMemo(() => {
    return cakePrice.times(cakeAmount).toNumber()
  }, [cakePrice, cakeAmount])
  const now = useCurrentBlockTimestamp()
  const unlockTimeToNow = useMemo(() => {
    return dayjs.unix(now).from(dayjs.unix(Number(roundedEndTime || 0)), true)
  }, [now, roundedEndTime])
  const migrate = useWriteMigrateCallback()

  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      <RowBetween>
        <Text color="textSubtle" bold fontSize={12} textTransform="uppercase">
          {t('my cake staking')}
        </Text>
        <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
          {t('Migration Needed')}
        </Tag>
      </RowBetween>
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('cake locked')}
            </Text>
            <Balance value={cakeAmount} decimals={2} fontWeight={600} fontSize={20} />
            <Balance prefix="~" value={cakeAmountUsdValue} decimals={2} unit="USD" fontSize={12} />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            <Text fontWeight={600} fontSize={20}>
              {unlockTimeToNow}
            </Text>
            <Text fontSize={12}>
              {t('on')} {formatTime(Number(dayjs.unix(Number(roundedEndTime || 0))))}
            </Text>
          </AutoColumn>
        </RowBetween>
        <Button width="100%" onClick={migrate}>
          {t('Migrate to veCAKE')}
        </Button>
      </StyledLockedCard>
      <Message variant="warning" icon={<InfoFilledIcon color="#D67E0A" />}>
        <Text as="p" color="#D67E0A">
          {t(
            'Migrate your CAKE staking position to veCAKE and enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
          )}
        </Text>
      </Message>
    </FlexGap>
  )
}

export const CakePoolLockStatus = () => {
  const { t } = useTranslation()
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My VeCAKE')}</Heading>
              <Balance fontSize="20px" bold color="failure" value={0} decimals={2} />
            </AutoColumn>
            <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
          </RowBetween>
        </CardHeader>
        <CakePoolLockInfo />
      </Card>
    </Box>
  )
}
