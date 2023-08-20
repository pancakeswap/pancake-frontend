import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeUSD } from 'state/farms/hooks'
import {
  Box,
  Flex,
  Text,
  Card,
  LinkExternal,
  Message,
  MessageText,
  WarningIcon,
  Balance,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
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

  const showYourSharePercentage = useMemo(() => new BigNumber(totalSupplyAt).gt(0), [totalSupplyAt])

  const availableCake = useMemo(() => getBalanceAmount(new BigNumber(availableClaim)).toNumber(), [availableClaim])
  const availableCakeUsdValue = useMemo(
    () => new BigNumber(availableCake).times(cakePriceBusd).toNumber(),
    [availableCake, cakePriceBusd],
  )

  const showExpireSoonWarning = useMemo(() => {
    const endTime = new BigNumber(nextDistributionTimestamp).plus(ONE_WEEK_DEFAULT)
    return new BigNumber(userData?.lockEndTime ?? '0').lt(endTime)
  }, [nextDistributionTimestamp, userData?.lockEndTime])

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
            <BenefitsTooltipsText
              title={t('Your shares')}
              tooltipComponent={
                <>
                  <Text>
                    {t('The virtual shares you currently own and the % against the whole revenue sharing pool.')}
                  </Text>
                  <Text m="4px 0">
                    {t(
                      'Please note that after locking or updating, your shares will only update upon revenue distributions.',
                    )}
                  </Text>
                  <NextLinkFromReactRouter
                    target="_blank"
                    to="https://docs.pancakeswap.finance/products/revenue-sharing/faq#50b7c683-feb0-47f6-809f-39c1a0976bb5"
                  >
                    <Text bold color="primary">
                      {t('Learn More')}
                    </Text>
                  </NextLinkFromReactRouter>
                </>
              }
            />
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
                  {showYourSharePercentage && (
                    <>
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
                </>
              )}
            </Box>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText
              title={t('Next distribution')}
              tooltipComponent={
                <Text>{t('Time remaining until the next revenue distribution and share updates.')}</Text>
              }
            />
            <Text color={showExpireSoonWarning ? 'failure' : 'text'} bold>
              {t('in %day%', { day: distanceToNowStrict(nextDistributionTimestamp * 1000) })}
            </Text>
          </Flex>
          {showExpireSoonWarning && (
            <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
              <MessageText lineHeight="120%">
                <Text fontSize="14px" color="failure">
                  {t(
                    'Your fixed-term staking position will have less than 1 week in remaining duration upon the next distribution.',
                  )}
                </Text>
                <Text fontSize="14px" color="failure" mt="4px">
                  {t('Extend your stakings to receive shares in the next distribution.')}
                </Text>
              </MessageText>
            </Message>
          )}

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText
              title={t('Last distribution')}
              tooltipComponent={<Text>{t('The time of the last revenue distribution and shares update.')}</Text>}
            />
            <Text bold>{timeFormat(locale, lastTokenTimestamp)}</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText
              title={t('Available for claiming')}
              tooltipComponent={<Text>{t('Amount of revenue available for claiming in CAKE.')}</Text>}
            />
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
        <LinkExternal external m="8px auto auto auto" href="https://docs.pancakeswap.finance/products/revenue-sharing">
          {t('Learn More')}
        </LinkExternal>
      </Box>
    </Card>
  )
}

export default RevenueSharing
