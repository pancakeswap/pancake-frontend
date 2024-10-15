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
import { formatBigInt, formatNumber, getBalanceAmount, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCakePrice } from 'hooks/useCakePrice'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { formatTime } from 'utils/formatTime'
import { CakeLockStatus } from 'views/CakeStaking/types'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { useProxyVeCakeBalance } from '../hooks/useProxyVeCakeBalance'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { DebugTooltips, Tooltips } from './Tooltips'
import { StyledLockedCard } from './styled'

dayjs.extend(relativeTime)

const LearnMore: React.FC<{ href?: string }> = ({
  href = 'https://docs.pancakeswap.finance/products/vecake/migrate-from-cake-pool#10ffc408-be58-4fa8-af56-be9f74d03f42',
}) => {
  const { t } = useTranslation()
  return (
    <Link href={href} color="text" external>
      {t('Learn More >>')}
    </Link>
  )
}

export const LockedVeCakeStatus: React.FC<{
  status: CakeLockStatus
}> = ({ status }) => {
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance()
  const { balance: proxyBalance } = useProxyVeCakeBalance()
  const { delegated, cakeLockExpired, cakePoolLockExpired } = useCakeLockStatus()
  const balanceBN = useMemo(() => getBalanceNumber(balance), [balance])
  const proxyCake = useMemo(() => getBalanceNumber(proxyBalance), [proxyBalance])
  const nativeCake = useMemo(() => getBalanceNumber(balance.minus(proxyBalance)), [balance, proxyBalance])

  if (status === CakeLockStatus.NotLocked) return null

  const balanceText =
    balanceBN > 0 && balanceBN < 0.01 ? (
      <UnderlineText fontSize="20px" bold color={balance.eq(0) ? 'failure' : 'secondary'}>
        {getBalanceAmount(balance).sd(2).toString()}
      </UnderlineText>
    ) : (
      <UnderlinedBalance
        underlined
        fontSize="20px"
        bold
        color={balance.eq(0) ? 'failure' : 'secondary'}
        value={getBalanceNumber(balance)}
        decimals={2}
      />
    )
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My veCAKE')}</Heading>
              <Tooltips
                content={
                  proxyBalance.gt(0) ? (
                    <DualStakeTooltip nativeBalance={nativeCake} proxyBalance={proxyCake} />
                  ) : (
                    <SingleStakeTooltip />
                  )
                }
              >
                {balanceText}
              </Tooltips>
            </AutoColumn>
            <DebugTooltips
              content={
                <pre>
                  {JSON.stringify(
                    {
                      balance: balance.toString(),
                      proxyBalance: proxyBalance.toString(),
                      nativeCake: nativeCake.toString(),
                      proxyCake: proxyCake.toString(),
                      delegated,
                      cakeLockExpired,
                      cakePoolLockExpired,
                    },
                    null,
                    2,
                  )}
                </pre>
              }
            >
              <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
            </DebugTooltips>
          </RowBetween>
        </CardHeader>
        <NativePosition />
        <MigratePosition />
      </Card>
    </Box>
  )
}

const CUSTOM_WARNING_COLOR = '#D67E0A'

const NativePosition = () => {
  const { t } = useTranslation()
  const { cakeLockExpired, cakeLockedAmount, nativeCakeLockedAmount, cakeUnlockTime, proxyCakeLockedAmount } =
    useCakeLockStatus()

  if (!nativeCakeLockedAmount) return null

  return (
    <FlexGap flexDirection="column" margin={24} gap="12px">
      <RowBetween>
        <Text color="secondary" bold fontSize={12} textTransform="uppercase">
          {t('native position')}
        </Text>
        {cakeLockExpired ? (
          <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
            {t('Unlocked')}
          </Tag>
        ) : null}
      </RowBetween>
      <FlexGap flexDirection="column" gap="24px">
        <StyledLockedCard gap="16px">
          <RowBetween>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('cake locked')}
              </Text>
              <CakeLocked lockedAmount={nativeCakeLockedAmount} />
            </AutoColumn>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('unlocks in')}
              </Text>
              <CakeUnlockAt expired={cakeLockExpired} unlockTime={Number(cakeUnlockTime)} />
            </AutoColumn>
          </RowBetween>
        </StyledLockedCard>
        {!proxyCakeLockedAmount && !cakeLockExpired ? (
          <Flex justifyContent="center">
            <img src="/images/cake-staking/my-cake-bunny.png" alt="my-cake-bunny" width="254px" />
          </Flex>
        ) : null}
        {cakeLockExpired ? (
          <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
            <Text as="p" color={CUSTOM_WARNING_COLOR}>
              {t(
                'Renew your veCAKE position to continue enjoying the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
              )}
            </Text>
          </Message>
        ) : null}
      </FlexGap>
      {cakeLockExpired && cakeLockedAmount ? <SubmitUnlockButton /> : null}
    </FlexGap>
  )
}

const MigratePosition = () => {
  const { t } = useTranslation()
  const { cakePoolLockExpired, cakePoolUnlockTime, nativeCakeLockedAmount, proxyCakeLockedAmount } = useCakeLockStatus()

  if (!proxyCakeLockedAmount) return null

  return (
    <FlexGap gap="12px" flexDirection="column" margin={24}>
      <RowBetween>
        <Text color="secondary" bold fontSize={12} textTransform="uppercase">
          {t('migrated position')}
        </Text>
        {cakePoolLockExpired ? (
          <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
            {t('Unlocked')}
          </Tag>
        ) : null}
      </RowBetween>
      <FlexGap flexDirection="column" gap="24px">
        <StyledLockedCard gap="16px">
          <RowBetween>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('cake locked')}
              </Text>
              <CakeLocked lockedAmount={proxyCakeLockedAmount} />
            </AutoColumn>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('unlocks in')}
              </Text>
              <CakeUnlockAt expired={cakePoolLockExpired} unlockTime={Number(cakePoolUnlockTime)} />
            </AutoColumn>
          </RowBetween>
        </StyledLockedCard>

        {cakePoolLockExpired ? (
          <Message variant="warning" icon={<InfoFilledIcon color="warning" />}>
            <Text as="p">
              {t(
                'CAKE Pool migrated position has unlocked. Go to the pool page to withdraw, add CAKE into veCAKE to increase your veCAKE benefits.',
              )}
            </Text>
          </Message>
        ) : nativeCakeLockedAmount ? (
          <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
            <AutoColumn gap="8px">
              <Text as="p">{t('Adding CAKE or extending CAKE will be applying to your native position.')}</Text>
              <LearnMore href="https://docs.pancakeswap.finance/products/vecake/faq#52f27118-bbf3-448b-9ffe-e9e1a9dd97ef" />
            </AutoColumn>
          </Message>
        ) : (
          <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
            <AutoColumn gap="8px">
              <Text as="p">
                {t(
                  'Position migrated from CAKE Pool can not be extended or topped up. To extend or add more CAKE, set up a native veCAKE position.',
                )}
              </Text>
              <LearnMore />
            </AutoColumn>
          </Message>
        )}
        <Link external style={{ textDecoration: 'none', width: '100%' }} href="/pools">
          <Button width="100%" variant="secondary">
            {t('View Migrated Position')}
          </Button>
        </Link>
      </FlexGap>
    </FlexGap>
  )
}

const SingleStakeTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t('veCAKE is calculated with number of CAKE locked, and the remaining time against maximum lock time.')}
      <LearnMore />
    </>
  )
}

const DualStakeTooltip: React.FC<{
  nativeBalance: number
  proxyBalance: number
}> = ({ nativeBalance, proxyBalance }) => {
  const { t } = useTranslation()

  return (
    <>
      {t('veCAKE is calculated with number of CAKE locked, and the remaining time against maximum lock time.')}
      <br />
      <br />
      <ul>
        <li>
          {t('Native:')} {formatNumber(nativeBalance, 2, 4)} veCAKE
        </li>
        <li>
          {t('Migrated:')} {formatNumber(proxyBalance, 2, 4)} veCAKE
        </li>
      </ul>
      <br />
      <LearnMore />
    </>
  )
}

export const CakeLocked: React.FC<{ lockedAmount: bigint }> = ({ lockedAmount }) => {
  const cakePrice = useCakePrice()
  const formattedCake = useMemo(() => Number(formatBigInt(lockedAmount, 18)), [lockedAmount])
  const cakeUsdValue: number = useMemo(() => {
    return cakePrice.times(formattedCake).toNumber()
  }, [cakePrice, formattedCake])

  return (
    <>
      <Balance value={formattedCake} decimals={2} fontWeight={600} fontSize={20} />
      <Balance prefix="~" value={cakeUsdValue} decimals={2} unit="USD" fontSize={12} />
    </>
  )
}

const CakeUnlockAt: React.FC<{
  expired: boolean
  unlockTime: number
}> = ({ unlockTime, expired }) => {
  const { t } = useTranslation()
  const now = useCurrentBlockTimestamp()
  const unlockTimeToNow = useMemo(() => {
    return unlockTime ? dayjs.unix(unlockTime).from(dayjs.unix(now), true) : ''
  }, [now, unlockTime])

  return (
    <>
      {expired ? (
        <Text fontWeight={600} fontSize={20} color={CUSTOM_WARNING_COLOR}>
          {t('Unlocked')}
        </Text>
      ) : (
        <Text fontWeight={600} fontSize={20}>
          {unlockTimeToNow}
        </Text>
      )}

      {unlockTime ? (
        <Text fontSize={12} color={expired ? CUSTOM_WARNING_COLOR : undefined}>
          {t('on')} {formatTime(Number(dayjs.unix(unlockTime)))}
        </Text>
      ) : null}
    </>
  )
}

const UnderlinedBalance = styled(Balance).withConfig({ shouldForwardProp: (prop) => prop !== 'underlined' })<{
  underlined?: boolean
}>`
  ${({ underlined }) =>
    underlined
      ? css`
          text-decoration: underline dotted;
          text-decoration-color: ${({ theme }) => theme.colors.textSubtle};
          text-underline-offset: 0.1em;
        `
      : ''}
`

const UnderlineText = styled(Text)`
  text-decoration: underline dotted;
  text-decoration-color: currentColor;
  text-underline-offset: 0.1em;
`

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()

  return (
    <Button variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </Button>
  )
}
