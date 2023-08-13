import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  ModalV2,
  useModalV2,
  Modal,
  Flex,
  Text,
  Box,
  PreTitle,
  Heading,
  InfoFilledIcon,
  Card,
} from '@pancakeswap/uikit'

import { ReactNode } from 'react'
import { GreyCard, LightGreyCard } from 'components/Card'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/sdk'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { CurrencyLogo } from 'components/Logo'

import { FixedStakingPool, UnstakeType } from '../type'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { DisclaimerCheckBox } from './DisclaimerCheckBox'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { StakedLimitEndOn } from './StakedLimitEndOn'

export function HarvestModal({
  stakingToken,
  children,
  lockPeriod,
  amountDeposit,
  accrueInterest,
  projectedReturnAmount,
  boostAPR,
  lockAPR,
  handleSubmission,
  pendingTx,
  onBack,
  poolEndDay,
}: {
  poolEndDay: number
  onBack: () => void
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  lockPeriod: number
  amountDeposit: CurrencyAmount<Token>
  accrueInterest: CurrencyAmount<Token>
  projectedReturnAmount: CurrencyAmount<Token>
  boostAPR: Percent
  lockAPR: Percent
  pendingTx: boolean
  handleSubmission: (type: UnstakeType) => void
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const restakeModal = useModalV2()

  return account ? (
    <>
      {children(restakeModal.onOpen)}
      <ModalV2 {...restakeModal} closeOnOverlayClick>
        <Modal
          title={
            <Flex>
              <CurrencyLogo currency={stakingToken} size="28px" />
              <Heading color="secondary" scale="lg" mx="8px">
                {t('Restake')} {stakingToken?.symbol}
              </Heading>
              <UnlockedFixedTag>{lockPeriod}D</UnlockedFixedTag>
            </Flex>
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          <Box mb="16px">
            <Card isActive mb="16px">
              <GreyCard>
                <Flex justifyContent="space-between" alignItems="baseline" mb="8px">
                  <PreTitle color="textSubtle">{t('Claim Reward')}</PreTitle>
                  <Box style={{ textAlign: 'end' }}>
                    <AmountWithUSDSub amount={accrueInterest} />
                  </Box>
                </Flex>
                <Flex>
                  <InfoFilledIcon color="secondary" mr="4px" />
                  <Text fontSize="14px" color="secondary">
                    {t('Claimed amount will be sent to your wallet')}
                  </Text>
                </Flex>
              </GreyCard>
            </Card>
            <Flex alignItems="center" mb="8px">
              <PreTitle textTransform="uppercase" bold mr="4px">
                {t('Restaking')}
              </PreTitle>
              <PreTitle color="textSubtle">{t('Position Overview')}</PreTitle>
            </Flex>
            <LightGreyCard>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Stake Amount')}
                </Text>
                <Text bold>
                  {amountDeposit.toSignificant(2)} {amountDeposit.currency.symbol}
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Duration')}
                </Text>
                <Text bold>
                  {lockPeriod} {t('days')}
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('APR')}
                </Text>
                <Text bold>{lockAPR?.toSignificant(2)}%</Text>
              </Flex>
              {boostAPR?.greaterThan(0) ? (
                <Flex alignItems="center" justifyContent="space-between">
                  <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                    {t('vCAKE Boost')}
                  </Text>
                  <Text bold>{boostAPR?.toSignificant(2)}%</Text>
                </Flex>
              ) : null}
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Fixed Staking Ends On')}
                </Text>
                <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
              </Flex>
              <Flex alignItems="baseline" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Projected Return')}
                </Text>
                <Box style={{ textAlign: 'end' }}>
                  <AmountWithUSDSub amount={projectedReturnAmount} />
                </Box>
              </Flex>
            </LightGreyCard>
          </Box>
          <DisclaimerCheckBox />
          <Button
            disabled={!amountDeposit.greaterThan(0) || pendingTx}
            style={{
              minHeight: '48px',
              marginBottom: '8px',
            }}
            onClick={() => handleSubmission(UnstakeType.HARVEST)}
          >
            {pendingTx ? t('Restaking') : t('Confirm Claim & Restake')}
          </Button>
          <Button
            onClick={() => {
              restakeModal.onDismiss()
              onBack()
            }}
            variant="secondary"
          >
            Back
          </Button>
        </Modal>
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
