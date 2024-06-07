import { useTranslation } from '@pancakeswap/localization'
import { useModal, Text } from '@pancakeswap/uikit'
import { useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'

import DisclaimerModal from 'components/DisclaimerModal'
import { useAffiliateExpired } from 'hooks/useAffiliateExpired'

export function AffiliateExpiredModal() {
  const { t } = useTranslation()
  const { address } = useAccount()
  const expired = useAffiliateExpired(address)
  const onConfirm = useCallback(() => {}, [])

  const [onOptionsConfirmModalPresent] = useModal(
    <DisclaimerModal
      bodyMaxWidth={['100%', '100%', '100%', '640px']}
      modalHeader={t('Pancakeswap Affiliate Program')}
      header={
        <>
          <Text>{t('Important Update')}</Text>
          <Text>
            {t(
              `Please be informed that the Affiliate who referred you and through whose referral link you signed up to trade is no longer part of PancakeSwap's Affiliate Program. As a result, effective immediately <date of notification sent>, you will no longer receive any trading discounts from this Affiliate if they were previously enabled.`,
            )}
          </Text>
          <Text>
            {t(
              `You can still access the affiliate claims dashboard until July 31, 2024. If you have any outstanding discounts unclaimed, please claim them before this date. After July 31, 2024, any unclaimed discounts will be forfeited, and you will no longer have access to the affiliate claims dashboard.`,
            )}
          </Text>
        </>
      }
      id="affiliate-expired-modal"
      checks={[
        {
          key: 'checkbox',
          content: t(`I've read and understood the following update.`),
        },
      ]}
      onSuccess={onConfirm}
    />,
    false,
    false,
    'affiliateExpiredModal',
  )

  useEffect(() => {
    if (expired) {
      onOptionsConfirmModalPresent()
    }
  }, [expired, onOptionsConfirmModalPresent])

  return null
}
