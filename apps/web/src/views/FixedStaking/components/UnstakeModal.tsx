import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'

import { UnstakeType } from '../type'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { ModalTitle } from './ModalTitle'

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
        onBack={() => {
          unstakeModal.onDismiss()
          onBack()
        }}
        title={<ModalTitle token={token} tokenTitle={token.symbol} lockPeriod={lockPeriod} isEnded />}
        width={['100%', '100%', '420px']}
        maxWidth={['100%', null, '420px']}
      >
        <LightCard mb="16px">
          <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
            {t('Unstaked Amount')}
          </Text>
          <AmountWithUSDSub fontSize="20px" amount={stakeAmount} />
        </LightCard>

        <Card
          isActive
          mb="16px"
          innerCardProps={{
            padding: '16px',
            opacity: '0.9',
          }}
        >
          <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
            {t('Reward Amount')}
          </Text>
          <AmountWithUSDSub fontSize="20px" amount={accrueInterest} />
        </Card>

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
            marginBottom: '8px',
          }}
          onClick={() => handleSubmission(UnstakeType.WITHDRAW, stakeAmount.add(accrueInterest))}
        >
          {loading ? t('Confirming') : t('Confirm Unstake')}
        </Button>
      </Modal>
    </ModalV2>
  )
}
