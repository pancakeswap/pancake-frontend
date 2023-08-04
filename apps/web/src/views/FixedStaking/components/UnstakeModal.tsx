import { CurrencyLogo, Flex, Heading, ModalV2, Modal, Text, Button, Balance } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { UnlockedFixedTag } from './UnlockedFixedTag'

function DetailCard({ title, amount, token }) {
  const formattedUsdStakingAmount = useStablecoinPriceAmount(token, parseFloat(amount.toSignificant(6)))

  return (
    <LightCard mb="16px">
      <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
        {title}
      </Text>
      <Text bold>
        {amount.toSignificant(2)} {token.symbol}
      </Text>
      <Balance
        color="textSubtle"
        unit=" USD"
        fontSize="12px"
        prefix="~"
        value={formattedUsdStakingAmount}
        decimals={2}
      />
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
        <DetailCard title={t('Unstaked Amount')} amount={stakeAmount} token={token} />

        <DetailCard title={t('Reward Amount')} amount={accrueInterest} token={token} />

        <Button
          disabled={loading}
          style={{
            minHeight: '48px',
          }}
          onClick={handleSubmission}
        >
          {loading ? t('Unstaking') : t('Unstake')}
        </Button>
      </Modal>
    </ModalV2>
  )
}
