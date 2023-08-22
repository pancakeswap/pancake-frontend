import { useEffect, useMemo } from 'react'
import { SubMenuItems, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useUserNotUsCitizenAcknowledgement, IdType } from 'hooks/useUserIsUsCitizenAcknowledgement'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import Hero from './components/Hero'
import IfoProvider from './contexts/IfoContext'

export const IfoPageLayout = ({ children }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isExact = router.route === '/ifo'

  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.IFO)
  const [onUSCitizenModalPresent] = useModal(
    <USCitizenConfirmModal
      title={t('PancakeSwap IFOs')}
      id={IdType.IFO}
      checks={[
        {
          key: 'checkbox',
          content: t('I confirm that I am eligible to participate in IFOs on this platform.'),
        },
      ]}
    />,
    false,
    false,
    'usCitizenConfirmModal',
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userNotUsCitizenAcknowledgement) {
        onUSCitizenModalPresent()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [userNotUsCitizenAcknowledgement, onUSCitizenModalPresent])

  const subMenuItems = useMemo(
    () => [
      {
        label: t('Latest'),
        href: '/ifo',
      },
      {
        label: t('Finished'),
        href: '/ifo/history',
      },
    ],
    [t],
  )

  return (
    <IfoProvider>
      <SubMenuItems items={subMenuItems} activeItem={isExact ? '/ifo' : '/ifo/history'} />
      <Hero />
      {children}
    </IfoProvider>
  )
}
