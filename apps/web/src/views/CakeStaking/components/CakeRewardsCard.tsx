import { useTranslation } from '@pancakeswap/localization'
import { DeserializedLockedCakeVault, ONE_WEEK_DEFAULT, VaultKey } from '@pancakeswap/pools'
import {
  AtomBox,
  Balance,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  LinkExternal,
  Message,
  MessageText,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Row,
  Text,
  WarningIcon,
  useToast,
} from '@pancakeswap/uikit'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRevenueSharingPoolGatewayContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useVaultPoolByKey } from 'state/pools/hooks'
import styled from 'styled-components'
import { getRevenueSharingPoolForCakeAddress } from 'utils/addressHelpers'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'
import useRevenueSharingPool from 'views/Pools/hooks/useRevenueSharingPool'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { useRevenueSharingPoolForCake } from '../hooks/useRevenueSharingPoolForCake'
import { MyVeCakeCard } from './MyVeCakeCard'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

// @notice
// migrate from: apps/web/src/views/Pools/components/RevenueSharing/BenefitsModal/RevenueSharing.tsx
export const CakeRewardsCard = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cakePriceBusd = useCakePrice()
  const { userData } = useVaultPoolByKey(VaultKey.CakeVault) as DeserializedLockedCakeVault
  const { balanceOfAt, totalSupplyAt, nextDistributionTimestamp, lastTokenTimestamp, availableClaim } =
    useRevenueSharingPoolForCake()
  const yourShare = useMemo(() => getBalanceAmount(new BigNumber(balanceOfAt)).toNumber(), [balanceOfAt])
  const yourSharePercentage = useMemo(
    () => new BigNumber(balanceOfAt).div(totalSupplyAt).times(100).toNumber() || 0,
    [balanceOfAt, totalSupplyAt],
  )

  const showYourSharePercentage = useMemo(() => new BigNumber(totalSupplyAt).gt(0), [totalSupplyAt])

  const { availableClaim: availableClaimFromCakePool } = useRevenueSharingPool()
  const availableCakePoolCake = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaimFromCakePool)).toNumber(),
    [availableClaimFromCakePool],
  )
  const availableCakePoolCakeUsdValue = useMemo(
    () => new BigNumber(availableCakePoolCake).times(cakePriceBusd).toNumber(),
    [availableCakePoolCake, cakePriceBusd],
  )

  const availableRevenueSharingCake = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaim)).toNumber(),
    [availableClaim],
  )
  const availableRevenueSharingCakeUsdValue = useMemo(
    () => new BigNumber(availableRevenueSharingCake).times(cakePriceBusd).toNumber(),
    [availableRevenueSharingCake, cakePriceBusd],
  )

  const showExpireSoonWarning = useMemo(() => {
    const endTime = new BigNumber(nextDistributionTimestamp).plus(ONE_WEEK_DEFAULT)
    return new BigNumber(userData?.lockEndTime ?? '0').lt(endTime)
  }, [nextDistributionTimestamp, userData?.lockEndTime])

  const showNoCakeAmountWarning = useMemo(
    () => new BigNumber(userData?.lockedAmount ?? '0').lte(0),
    [userData?.lockedAmount],
  )

  const currentDate = Date.now() / 1000
  const timeRemaining = nextDistributionTimestamp - currentDate
  const { days, hours, minutes, seconds } = getTimePeriods(timeRemaining)

  const nextDistributionTime = useMemo(() => {
    if (!days && hours && minutes && seconds) {
      return `< 1 ${t('day')}`
    }

    return t('in %day% days', { day: days })
  }, [days, hours, minutes, seconds, t])

  return (
    <ModalContainer
      title={t('CAKE Reward / Yield')}
      style={{ minWidth: '375px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
    >
      <AtomBox
        justifyContent="space-between"
        bg="gradientBubblegum"
        p="24px"
        maxWidth="420px"
        height="100%"
        style={{ margin: '-24px' }}
      >
        <StyledModalHeader headerBorderColor="transparent">
          <ModalTitle>
            <Heading scale="md">{t('CAKE Reward / Yield')}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </StyledModalHeader>

        <ModalBody>
          <Row>
            <Text fontSize="16px" bold color="secondary">
              {t('EARN CAKE')}
            </Text>
            <Text fontSize="16px" bold color="textSubtle" ml="3px">
              {t('WEEKLY')}
            </Text>
          </Row>
          <Text fontSize="14px" color="textSubtle" mb="16px" mt="13px">
            {t('From CAKE pool rewards and revenue sharing!')}
          </Text>
          <MyVeCakeCard />
          <Card mt="16px">
            <Box padding={16}>
              {/* <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                {t('revenue sharing')}
              </Text> */}
              <Box>
                <Flex flexDirection="row" alignItems="center">
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
                        <LinkExternal href="https://docs.pancakeswap.finance/products/revenue-sharing/faq#50b7c683-feb0-47f6-809f-39c1a0976bb5">
                          <Text bold color="primary">
                            {t('Learn More')}
                          </Text>
                        </LinkExternal>
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
                          <Balance
                            display="inline-block"
                            color="success"
                            fontWeight={800}
                            value={yourShare}
                            decimals={2}
                          />
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
                    {nextDistributionTime}
                  </Text>
                </Flex>
                {showExpireSoonWarning && (
                  <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
                    <MessageText lineHeight="120%">
                      <Text fontSize="14px" color="failure">
                        {t(
                          'Your CAKE staking position will have less than 1 week in remaining duration upon the next distribution.',
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
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('cake pool')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in CAKE.')}</Text>}
                    />
                    <Box>
                      {availableCakePoolCake > 0 && availableCakePoolCake <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 CAKE`}</Text>
                      ) : (
                        <Balance unit=" CAKE" textAlign="right" bold value={availableCakePoolCake} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableCakePoolCakeUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('revenue sharing')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in CAKE.')}</Text>}
                    />
                    <Box>
                      {availableRevenueSharingCake > 0 && availableRevenueSharingCake <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 CAKE`}</Text>
                      ) : (
                        <Balance unit=" CAKE" textAlign="right" bold value={availableRevenueSharingCake} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableRevenueSharingCakeUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('total')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Available for claiming')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in CAKE.')}</Text>}
                    />
                    <Box>
                      {availableRevenueSharingCake > 0 && availableRevenueSharingCake <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 CAKE`}</Text>
                      ) : (
                        <Balance unit=" CAKE" textAlign="right" bold value={availableRevenueSharingCake} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableRevenueSharingCakeUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
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
                href="https://docs.pancakeswap.finance/products/revenue-sharing"
              >
                {t('Learn More')}
              </LinkExternal>
            </Box>
          </Card>
        </ModalBody>
      </AtomBox>
    </ModalContainer>
  )
}

const ClaimButton: React.FC<{
  availableClaim: string
  onDismiss?: () => void
}> = ({ availableClaim, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolGatewayContract()
  // @todo @ChefJerry update revenueSharingPools
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => new BigNumber(availableClaim).gt(0) && !isPending, [availableClaim, isPending])

  const handleClaim = useCallback(async () => {
    try {
      if (!account || !chainId) return

      const revenueSharingPools = [getRevenueSharingPoolForCakeAddress(chainId)]
      const receipt = await fetchWithCatchTxError(() =>
        contract.write.claimMultiple([revenueSharingPools, account], { account, chain: contract.chain }),
      )

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully claimed your rewards.')}
          </ToastDescriptionWithTx>,
        )

        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit Revenue Claim Button', error)
    }
  }, [account, chainId, contract.chain, contract.write, fetchWithCatchTxError, onDismiss, t, toastSuccess])

  return (
    <Button mt="24px" width="100%" variant="subtle" disabled={!isReady} onClick={handleClaim}>
      {t('Claim All')}
    </Button>
  )
}
