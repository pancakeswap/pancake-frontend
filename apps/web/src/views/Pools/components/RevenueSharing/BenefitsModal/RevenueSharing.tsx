import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeUSD } from 'state/farms/hooks'
import {
  Box,
  Flex,
  Text,
  TooltipText,
  Card,
  LinkExternal,
  Message,
  MessageText,
  WarningIcon,
  Balance,
} from '@pancakeswap/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import useRevenueSharingPool from 'views/Pools/hooks/useRevenueSharingPool'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { distanceToNowStrict } from 'utils/timeHelper'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import ClaimButton from 'views/Pools/components/RevenueSharing/BenefitsModal/ClaimButton'

interface RevenueSharingProps {
  onDismiss?: () => void
}

const RevenueSharing: React.FunctionComponent<React.PropsWithChildren<RevenueSharingProps>> = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cakePriceBusd = usePriceCakeUSD()
  const { userData } = useVaultPoolByKey(VaultKey.CakeVault) as DeserializedLockedCakeVault

  const { balanceOfAt, totalSupplyAt, nextDistributionTimestamp, lastTokenTimestamp, availableClaim } =
    useRevenueSharingPool()
  console.log({ balanceOfAt, totalSupplyAt, nextDistributionTimestamp, lastTokenTimestamp, availableClaim })
  const yourShare = useMemo(() => getBalanceAmount(new BigNumber(balanceOfAt)).toNumber(), [balanceOfAt])
  const yourSharePercentage = useMemo(
    () => new BigNumber(balanceOfAt).div(totalSupplyAt).toNumber() || 0,
    [balanceOfAt, totalSupplyAt],
  )

  const availableCake = useMemo(() => getBalanceAmount(new BigNumber(availableClaim)).toNumber(), [availableClaim])
  const availableCakeUsdValue = useMemo(
    () => new BigNumber(availableCake).times(cakePriceBusd).toNumber(),
    [availableCake, cakePriceBusd],
  )

  const showExpireSoonWarning = useMemo(
    () => new BigNumber(userData?.lockEndTime ?? '0').lt(lastTokenTimestamp),
    [lastTokenTimestamp, userData?.lockEndTime],
  )

  const showNoCakeAmountWarning = useMemo(
    () => new BigNumber(userData?.lockedAmount ?? '0').lte(0),
    [userData?.lockedAmount],
  )

  return (
    <Card isActive>
      <Box padding={16}>
        <Text fontSize={12} bold color="secondary" textTransform="uppercase">
          {t('revenue sharing')}
        </Text>
        <Box mt="8px">
          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              {t('Your shares')}
            </TooltipText>
            <Box>
              {yourShare === 0 ? (
                <Text bold color="failure">
                  0
                </Text>
              ) : (
                <>
                  <Balance display="inline-block" bold value={yourShare} decimals={2} />
                  <Balance
                    display="inline-block"
                    prefix="("
                    unit="%)"
                    ml="4px"
                    value={yourSharePercentage}
                    decimals={2}
                  />
                </>
              )}
            </Box>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              {t('Next distribution')}
            </TooltipText>
            <Text color={showExpireSoonWarning ? 'failure' : 'text'} bold>
              {t('in %day%', { day: distanceToNowStrict(nextDistributionTimestamp * 1000) })}
            </Text>
          </Flex>
          {showExpireSoonWarning && (
            <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
              <MessageText lineHeight="120%">
                {t('Your fixed-term staking position will expire before the next revenue sharing distributions.')}
              </MessageText>
            </Message>
          )}

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              {t('Last distribution')}
            </TooltipText>
            <Text bold>{timeFormat(locale, lastTokenTimestamp)}</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              {t('Available for claiming')}
            </TooltipText>
            <Box>
              <Balance unit=" CAKE" bold value={availableCake} decimals={2} />
              <Balance
                ml="4px"
                color="textSubtle"
                fontSize={12}
                textAlign="right"
                lineHeight="110%"
                prefix="(~ $"
                unit=")"
                value={availableCakeUsdValue}
                decimals={2}
              />
            </Box>
          </Flex>
        </Box>
        {showNoCakeAmountWarning && (
          <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
            <MessageText lineHeight="120%">
              {t('You need to update your staking in order to start earning from protocol revenue sharing.')}
            </MessageText>
          </Message>
        )}
        <ClaimButton availableClaim={availableClaim} onDismiss={onDismiss} />
        <LinkExternal
          external
          m="8px auto auto auto"
          href="https://docs.pancakeswap.finance/products/trading-reward/how-to-participate"
        >
          {t('Learn More')}
        </LinkExternal>
      </Box>
    </Card>
  )
}

export default RevenueSharing
