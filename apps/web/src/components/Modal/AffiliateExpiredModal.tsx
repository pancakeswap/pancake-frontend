import { useTranslation } from '@pancakeswap/localization'
import { useModal, Text, LinkExternal } from '@pancakeswap/uikit'
import { ReactNode, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'

import DisclaimerModal from 'components/DisclaimerModal'
import { useAffiliateExpired } from 'hooks/useAffiliateExpired'
import { useUserAcknowledgement } from 'hooks/useUserAcknowledgement'

const transRegex = /(%[^%]+%)/

function Trans({ text, data = {} }: { text: string; data?: { [key: string]: ReactNode } }) {
  const parts = text.split(transRegex)
  return parts.map((p) => {
    if (!transRegex.test(p)) {
      return p
    }
    const key = p.replace(/%/g, '')
    return data[key] || p
  })
}

export function AffiliateExpiredModal() {
  const { t } = useTranslation()
  const { address } = useAccount()
  const expired = useAffiliateExpired(address)
  const [ack, setACK] = useUserAcknowledgement('affiliate-referral-expired-v2')
  const onConfirm = useCallback(() => setACK(true), [setACK])

  const [onOptionsConfirmModalPresent] = useModal(
    <DisclaimerModal
      bodyMaxWidth={['100%', '100%', '100%', '640px']}
      bodyMaxHeight="80vh"
      modalHeader={t('PancakeSwap Affiliate Program')}
      header={
        <>
          <Text bold fontSize="1.25rem">
            {t('Important Update')}
          </Text>
          <Text mt="1.5rem">
            {t(
              `Please be informed that the Affiliate who referred you and through whose referral link you signed up to trade is no longer part of PancakeSwap's Affiliate Program. As a result, effective immediately %time%, you will no longer receive any trading discounts from this Affiliate if they were previously enabled.`,
              {
                time: '5 Sep 2024',
              },
            )}
          </Text>
          <Text mt="1.5rem">
            <Trans
              text={t(
                `You can still access the affiliate claims dashboard until %time%. If you have any outstanding discounts unclaimed, please %claim% them before this date. After %time%, any unclaimed discounts will be forfeited, and you will no longer have access to the affiliate claims dashboard.`,
                { time: 'Oct 31, 2024' },
              )}
              data={{
                claim: (
                  <LinkExternal
                    bold
                    style={{ display: 'inline-flex' }}
                    showExternalIcon={false}
                    href="/affiliates-program/dashboard"
                  >
                    {t('claim')}
                  </LinkExternal>
                ),
              }}
            />
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
    if (expired && ack === false) {
      onOptionsConfirmModalPresent()
    }
  }, [expired, ack, onOptionsConfirmModalPresent])

  return null
}
