import { CurrencyLogo, Flex, Heading, ModalV2, Modal, Text, Button } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'

import { UnlockedFixedTag } from './UnlockedFixedTag'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { UnstakeType } from '../type'

function DetailCard({ title, amount }: { title: string; amount: CurrencyAmount<Token> }) {
  return (
    <LightCard mb="16px">
      <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
        {title}
      </Text>
      <AmountWithUSDSub amount={amount} />
    </LightCard>
  )
}

export function UnstakeEndedModal({
  unstakeModal,
  lockPeriod,
  token,
  handleSubmission,
  stakeAmount,
  accrueInterest,
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
        <DetailCard title={t('Unstaked Amount')} amount={stakeAmount} />

        <DetailCard title={t('Reward Amount')} amount={accrueInterest} />

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
          }}
          onClick={() => handleSubmission(UnstakeType.WITHDRAW)}
        >
          {loading ? t('Unstaking') : t('Unstake')}
        </Button>
      </Modal>
    </ModalV2>
  )
}
