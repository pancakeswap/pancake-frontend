import { CurrencyLogo, Flex, Heading, ModalV2, Modal, Text, Button, Card } from '@pancakeswap/uikit'
import { GreyCard, LightCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'

import { UnlockedFixedTag } from './UnlockedFixedTag'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { UnstakeType } from '../type'

export function UnstakeEndedModal({
  unstakeModal,
  lockPeriod,
  token,
  handleSubmission,
  stakeAmount,
  accrueInterest,
  loading,
  onBack,
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
        <Card isActive mb="16px">
          <GreyCard>
            <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
              {t('Unstaked Amount')}
            </Text>
            <AmountWithUSDSub amount={stakeAmount} />
          </GreyCard>
        </Card>

        <LightCard mb="16px">
          <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
            {t('Reward Amount')}
          </Text>
          <AmountWithUSDSub amount={accrueInterest} />
        </LightCard>

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
            marginBottom: '8px',
          }}
          onClick={() =>
            handleSubmission(UnstakeType.WITHDRAW, stakeAmount.add(accrueInterest)).then(() => unstakeModal.onDismiss())
          }
        >
          {loading ? t('Confirming') : t('Confirm Unstake')}
        </Button>
        <Button
          disabled={loading}
          variant="secondary"
          onClick={() => {
            unstakeModal.onDismiss()
            onBack()
          }}
        >
          Back
        </Button>
      </Modal>
    </ModalV2>
  )
}
