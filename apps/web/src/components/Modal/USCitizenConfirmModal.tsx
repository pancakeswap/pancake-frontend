import DisclaimerModal, { CheckType } from 'components/DisclaimerModal'
import { useUserNotUsCitizenAcknowledgement, IdType } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { ReactNode, memo, useCallback, useEffect } from 'react'
import { Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { usePreviousValue } from '@pancakeswap/hooks'

interface USCitizenConfirmModalProps {
  id: IdType
  title: string
  desc?: ReactNode
  checks?: CheckType[]
  href?: string
  onDismiss?: () => void
}

const USCitizenConfirmModal: React.FC<React.PropsWithChildren<USCitizenConfirmModalProps>> = ({
  id,
  title,
  checks,
  onDismiss,
  href,
  desc,
}) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const previousPathname = usePreviousValue(pathname)
  const [, setHasAcceptedRisk] = useUserNotUsCitizenAcknowledgement(id)

  const handleSuccess = useCallback(() => {
    setHasAcceptedRisk(true)
    if (href) {
      window.open(href, '_blank', 'noopener noreferrer')
    }
    onDismiss?.()
  }, [setHasAcceptedRisk, onDismiss, href])

  useEffect(() => {
    if (previousPathname && pathname !== previousPathname) {
      onDismiss?.()
    }
  }, [pathname, previousPathname, onDismiss])

  return (
    <DisclaimerModal
      modalHeader={title}
      id={id}
      header={t('To proceed to %title%, please check the checkbox below:', { title })}
      checks={
        checks ?? [
          {
            key: 'checkbox',
            content: t(
              'I confirm that I am not from a prohibited jurisdiction and I am eligible to trade derivatives on this platform.',
            ),
          },
        ]
      }
      footer={
        <>
          <Text as="span">{t('By proceeding, you agree to comply with our')}</Text>
          <Link external m="0 4px" style={{ display: 'inline' }} href="/terms-of-service">
            {t('terms and conditions')}
          </Link>
          <Text as="span">{t('and all relevant laws and regulations.')}</Text>
          {desc}
        </>
      }
      onSuccess={handleSuccess}
      onDismiss={onDismiss}
      headerStyle={{ fontWeight: 400, fontSize: 18 }}
      footerStyle={{ fontWeight: 600, fontSize: 18 }}
    />
  )
}

export default memo(USCitizenConfirmModal)
