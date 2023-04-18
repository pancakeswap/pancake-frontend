import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useChainNameByQuery } from 'state/info/hooks'
import { v3InfoPath } from '../../constants'
import InfoNav from './InfoNav'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const isV3 = router.pathname.includes(v3InfoPath)
  const { t } = useTranslation()

  return (
    <>
      <SubMenuItems
        items={[
          {
            label: t('V3'),
            href: '/info/v3',
          },
          {
            label: t('V2'),
            href: '/info',
          },
          chainName === 'BSC' && {
            label: t('StableSwap'),
            href: '/info?type=stableSwap',
          },
        ]}
        activeItem={isV3 ? '/info/v3' : '/info'}
      />
      <InfoNav isStableSwap={false} />
      {children}
    </>
  )
}
