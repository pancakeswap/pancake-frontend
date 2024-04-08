import { useCallback, useState } from 'react'
import { Flex, Text, Button, Link, ModalV2 } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { useUserNotUsCitizenAcknowledgement, IdType } from 'hooks/useUserIsUsCitizenAcknowledgement'

const Congratulations = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.AFFILIATE_PROGRAM)
  const handleDismiss = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <ModalV2 style={{ zIndex: 100 }} isOpen={isOpen} onDismiss={handleDismiss}>
        <USCitizenConfirmModal title={t('PancakeSwap Affiliate Program')} id={IdType.AFFILIATE_PROGRAM} />
      </ModalV2>
      <Flex flexDirection="column" padding={['24px', '24px', '24px', '24px', '80px 24px']}>
        <Text lineHeight="110%" maxWidth="190px" fontSize={['24px']} bold m="12px 0">
          {t('Congratulations! You’re all set!')}
        </Text>
        <Text color="textSubtle" fontSize="14px" mb="24px">
          {t('Start trading and enjoy referral discounts!')}
        </Text>
        <Link external href="/swap" width="100% !important">
          <Button width="100%">{t('Start Trading')}</Button>
        </Link>
        <Link
          external
          href="https://perp.pancakeswap.finance/en/futures/BTCUSDT"
          width="100% !important"
          onClick={(e) => {
            if (!userNotUsCitizenAcknowledgement) {
              e.stopPropagation()
              e.preventDefault()
              setIsOpen(true)
            }
          }}
        >
          <Button width="100%" m="8px 0" variant="secondary">
            {t('Try out our Perpetuals Platform')}
          </Button>
        </Link>
        <Link external href="https://docs.pancakeswap.finance/affiliate-program" width="100% !important">
          <Button width="100%" variant="secondary">
            {t('Learn More')}
          </Button>
        </Link>
      </Flex>
    </>
  )
}

export default Congratulations
