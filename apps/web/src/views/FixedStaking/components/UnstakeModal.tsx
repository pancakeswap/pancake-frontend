import { CurrencyLogo, Flex, Heading, ModalV2, Modal, Message, MessageText, Text, Button } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { format } from 'date-fns'
import { LockedFixedTag } from './LockedFixedTag'
import { UnlockedFixedTag } from './UnlockedFixedTag'

export function UnstakeEndedModal({
  unstakeModal,
  lockPeriod,
  token,
  handleSubmission,
  stakeAmount,
  accrueInterest,
  unlockTime,
  loading,
}) {
  const { t } = useTranslation()

  return (
    <ModalV2 {...unstakeModal} closeOnOverlayClick>
      <Modal
        title={
          <Flex>
            <CurrencyLogo currency={token} size="28px" />
            <Heading color="secondary" scale="lg" mx="8px">
              {token?.symbol}
            </Heading>
            <UnlockedFixedTag>
              {lockPeriod}D {t('Ended')}
            </UnlockedFixedTag>{' '}
          </Flex>
        }
        width={['100%', '100%', '420px']}
        maxWidth={['100%', , '420px']}
      >
        <LightCard mb="16px">
          <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
            {t('Staking Amount')}
          </Text>
          <Text bold>
            {stakeAmount.toSignificant(2)} {token.symbol}
          </Text>

          <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
            {t('Earnings since ')} {format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}
          </Text>
          <Text bold>
            {accrueInterest.toSignificant(2)} {token.symbol}
          </Text>
        </LightCard>

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
          }}
          onClick={handleSubmission}
        >
          {loading ? t('Unstaking') : t('Confirm Unstake')}
        </Button>
      </Modal>
    </ModalV2>
  )
}

export function UnstakeModal({
  unstakeModal,
  loading,
  lockPeriod,
  token,
  handleSubmission,
  totalGetAmount,
  withdrawFee,
}) {
  const { t } = useTranslation()

  return (
    <ModalV2 {...unstakeModal} closeOnOverlayClick>
      <Modal
        title={
          <Flex>
            <CurrencyLogo currency={token} size="28px" />
            <Heading color="secondary" scale="lg" mx="8px">
              {token?.symbol}
            </Heading>

            <LockedFixedTag>{lockPeriod}D</LockedFixedTag>
          </Flex>
        }
        width={['100%', '100%', '420px']}
        maxWidth={['100%', , '420px']}
      >
        <LightCard mb="16px">
          <Message variant="warning" mb="16px">
            <MessageText maxWidth="200px">
              {t('No rewards are credited for early withdrawal, and commission is required')}
            </MessageText>
          </Message>
          <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
            {t('Commission for early withdrawal:')}
          </Text>
          <Text bold>
            {withdrawFee.toSignificant(2)} {token.symbol}
          </Text>
          <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
            {t('You will get:')}
          </Text>
          <Text bold>
            {totalGetAmount.toSignificant(2)} {token.symbol}
          </Text>
        </LightCard>

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
          }}
          onClick={handleSubmission}
        >
          {loading ? t('Staking') : t('Confirm Unstake')}
        </Button>
      </Modal>
    </ModalV2>
  )
}
