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
  Text,
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
import { Tooltips } from './Tooltips'
import { StyledLockedCard } from './styled'

dayjs.extend(relativeTime)

const LearnMore = () => {
  const { t } = useTranslation()
  return (
    <Link
      href="https://docs.pancakeswap.finance/products/vecake/migrate-from-cake-pool#10ffc408-be58-4fa8-af56-be9f74d03f42"
      color="text"
    >
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
              <Heading color="text">{t('My VeCAKE')}</Heading>
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
            <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="token-vecake" />
          </RowBetween>
        </CardHeader>
        <LockedInfo />
      </Card>
    </Box>
  )
}

const CUSTOM_WARNING_COLOR = '#D67E0A'

const LockedInfo = () => {
  const { t } = useTranslation()
  const {
    cakeUnlockTime,
    nativeCakeLockedAmount,
    proxyCakeLockedAmount,
    cakePoolLocked,
    cakePoolUnlockTime,
    cakeLocked,
    cakeLockExpired,
    cakePoolLockExpired,
  } = useCakeLockStatus()
  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('cake locked')}
            </Text>
            <CakeLocked
              proxyExpired={cakePoolLockExpired}
              proxyUnlockTime={cakePoolUnlockTime}
              nativeCakeLocked={nativeCakeLockedAmount}
              proxyCakeLocked={proxyCakeLockedAmount}
            />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            <CakeUnlockAt
              proxyCakeLocked={proxyCakeLockedAmount}
              nativeLocked={cakeLocked}
              nativeExpired={cakeLockExpired}
              proxyLocked={cakePoolLocked}
              proxyExpired={cakePoolLockExpired}
              nativeUnlockTime={cakeUnlockTime}
              proxyUnlockTime={cakePoolUnlockTime}
            />
          </AutoColumn>
        </RowBetween>
      </StyledLockedCard>
      {cakePoolLocked ? (
        <>
          {cakePoolLockExpired ? (
            <Message variant="warning" icon={<InfoFilledIcon color="warning" />}>
              <Text as="p">
                {t(
                  'CAKE Pool migrated position has unlocked. Go to the pool page to withdraw, add CAKE into veCAKE to increase your veCAKE benefits.',
                )}
              </Text>
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
              {t('View CAKE Pool Position')}
            </Button>
          </Link>
        </>
      ) : null}
      {/* if both veCake and cakePool expired, user should deal with cake pool first */}
      {cakeLockExpired && !cakePoolLockExpired ? (
        <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
          <Text as="p" color={CUSTOM_WARNING_COLOR}>
            {t(
              'Renew your veCAKE position to continue enjoying the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
            )}
          </Text>
        </Message>
      ) : null}
      {!cakeLockExpired ? (
        <Flex justifyContent="center">
          <img src="/images/cake-staking/my-cake-bunny.png" alt="my-cake-bunny" width="254px" />
        </Flex>
      ) : null}
      {/* if both veCake and cakePool expired, user should deal with cake pool first */}
      {cakeLockExpired && !cakePoolLockExpired ? <SubmitUnlockButton /> : null}
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

const ProxyUnlockTooltip: React.FC<{
  proxyExpired: boolean
  proxyCake: number
  proxyUnlockTime: number
}> = ({ proxyExpired, proxyCake, proxyUnlockTime }) => {
  const { t } = useTranslation()

  return (
    <>
      {t(
        proxyExpired
          ? '%amount% CAKE from CAKE Pool migrated position is already unlocked. Go to the pool page to withdraw these CAKE.'
          : '%amount% CAKE from CAKE Pool migrated position will unlock on %expiredAt%.',
        {
          amount: proxyCake,
          expiredAt: formatTime(Number(dayjs.unix(proxyUnlockTime))),
        },
      )}
      <LearnMore />
    </>
  )
}

export const CakeLocked: React.FC<{
  nativeCakeLocked: bigint
  proxyCakeLocked: bigint
  proxyExpired: boolean
  proxyUnlockTime: number
}> = ({ nativeCakeLocked, proxyCakeLocked, proxyExpired, proxyUnlockTime }) => {
  const cakePrice = useCakePrice()
  const nativeCake = useMemo(() => Number(formatBigInt(nativeCakeLocked, 18)), [nativeCakeLocked])
  const nativeCakeUsdValue: number = useMemo(() => {
    return cakePrice.times(nativeCake).toNumber()
  }, [cakePrice, nativeCake])
  const proxyCake = useMemo(() => Number(formatBigInt(proxyCakeLocked, 18)), [proxyCakeLocked])
  const totalCake = useMemo(
    () => Number(formatBigInt(nativeCakeLocked + proxyCakeLocked, 18)),
    [nativeCakeLocked, proxyCakeLocked],
  )
  const totalCakeUsdValue: number = useMemo(() => {
    return cakePrice.times(totalCake).toNumber()
  }, [cakePrice, totalCake])

  if (!proxyCakeLocked && nativeCakeLocked) {
    return (
      <>
        <Balance value={nativeCake} decimals={2} fontWeight={600} fontSize={20} />
        <Balance prefix="~" value={nativeCakeUsdValue} decimals={2} unit="USD" fontSize={12} />
      </>
    )
  }

  return (
    <>
      <Tooltips
        content={
          <ProxyUnlockTooltip proxyExpired={proxyExpired} proxyCake={proxyCake} proxyUnlockTime={proxyUnlockTime} />
        }
      >
        <UnderlinedBalance value={totalCake} decimals={2} fontWeight={600} fontSize={20} underlined />
      </Tooltips>
      <Balance prefix="~" value={totalCakeUsdValue} decimals={2} unit="USD" fontSize={12} />
    </>
  )
}

const CakeUnlockAt: React.FC<{
  proxyCakeLocked: bigint
  nativeLocked: boolean
  nativeExpired: boolean
  proxyLocked: boolean
  proxyExpired: boolean
  nativeUnlockTime: number
  proxyUnlockTime: number
}> = ({
  proxyCakeLocked,
  nativeLocked,
  nativeExpired,
  nativeUnlockTime,
  proxyLocked,
  proxyExpired,
  proxyUnlockTime,
}) => {
  const { t } = useTranslation()
  const proxyCake = useMemo(() => Number(formatBigInt(proxyCakeLocked, 18)), [proxyCakeLocked])
  const now = useCurrentBlockTimestamp()
  const [unlocked, unlockTime, unlockTimeToNow] = useMemo(() => {
    const nowDay = dayjs.unix(Number(now || 0))
    if (!nativeLocked && proxyLocked) {
      return [proxyExpired, proxyUnlockTime, proxyUnlockTime ? dayjs.unix(proxyUnlockTime).from(nowDay, true) : '']
    }
    return [nativeExpired, nativeUnlockTime, nativeUnlockTime ? dayjs.unix(nativeUnlockTime).from(nowDay, true) : '']
  }, [nativeExpired, nativeLocked, nativeUnlockTime, now, proxyExpired, proxyLocked, proxyUnlockTime])

  const TextComp = proxyLocked ? UnderlineText : Text

  const unlockText = (
    <>
      {unlocked ? (
        <TextComp fontWeight={600} fontSize={20} color={CUSTOM_WARNING_COLOR}>
          {t('Unlocked')}
        </TextComp>
      ) : (
        <TextComp fontWeight={600} fontSize={20}>
          {unlockTimeToNow}
        </TextComp>
      )}

      {unlockTime ? (
        <Text fontSize={12} color={unlocked ? CUSTOM_WARNING_COLOR : undefined}>
          {t('on')} {formatTime(Number(dayjs.unix(unlockTime)))}
        </Text>
      ) : null}
    </>
  )

  if (!proxyLocked) return unlockText

  return (
    <Tooltips
      content={
        <ProxyUnlockTooltip proxyExpired={proxyExpired} proxyCake={proxyCake} proxyUnlockTime={proxyUnlockTime} />
      }
    >
      {unlockText}
    </Tooltips>
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
  const { cakeLockedAmount } = useCakeLockStatus()

  if (!cakeLockedAmount) {
    return null
  }

  return (
    <Button variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </Button>
  )
}
