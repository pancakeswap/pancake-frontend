import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { Box, Flex, Text, Card, LinkExternal, Message, MessageText, WarningIcon, Balance } from '@pancakeswap/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import useRevenueSharingPool from 'views/Pools/hooks/useRevenueSharingPool'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { distanceToNowStrict } from 'utils/timeHelper'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import ClaimButton from 'views/Pools/components/RevenueSharing/BenefitsModal/ClaimButton'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'

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
  const yourShare = useMemo(() => getBalanceAmount(new BigNumber(balanceOfAt)).toNumber(), [balanceOfAt])
  const yourSharePercentage = useMemo(
    () => new BigNumber(balanceOfAt).div(totalSupplyAt).times(100).toNumber() || 0,
    [balanceOfAt, totalSupplyAt],
  )

  const availableCake = useMemo(() => getBalanceAmount(new BigNumber(availableClaim)).toNumber(), [availableClaim])
  const availableCakeUsdValue = useMemo(
    () => new BigNumber(availableCake).times(cakePriceBusd).toNumber(),
    [availableCake, cakePriceBusd],
  )

  const showExpireSoonWarning = useMemo(
    () => new BigNumber(userData?.lockEndTime ?? '0').lt(nextDistributionTimestamp),
    [nextDistributionTimestamp, userData?.lockEndTime],
  )

  const showNoCakeAmountWarning = useMemo(
    () => new BigNumber(userData?.lockedAmount ?? '0').lte(0),
    [userData?.lockedAmount],
  )

  return (
    <Card isActive mb={['24px', '24px', '24px', '0']}>
      <Box padding={16}>
        <Text fontSize={12} bold color="secondary" textTransform="uppercase">
          {t('revenue sharing')}
        </Text>
        <Box mt="8px">
          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText title={t('Your shares')} tooltipComponent={<>132</>} />
            <Box>
              {yourShare === 0 ? (
                <Text bold color="failure">
                  0
                </Text>
              ) : (
                <>
                  {yourShare <= 0.01 ? (
                    <Text as="span" bold>{`< 0.01`}</Text>
                  ) : (
                    <Balance display="inline-block" bold value={yourShare} decimals={2} />
                  )}
                  {yourSharePercentage <= 0.01 ? (
                    <Text as="span" ml="4px">{`(< 0.01%)`}</Text>
                  ) : (
                    <Balance
                      display="inline-block"
                      prefix="("
                      unit="%)"
                      ml="4px"
                      value={yourSharePercentage}
                      decimals={2}
                    />
                  )}
                </>
              )}
            </Box>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText title={t('Next distribution')} tooltipComponent={<>132</>} />
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
            <BenefitsTooltipsText title={t('Last distribution')} tooltipComponent={<>132</>} />
            <Text bold>{timeFormat(locale, lastTokenTimestamp)}</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText title={t('Available for claiming')} tooltipComponent={<>132</>} />
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
