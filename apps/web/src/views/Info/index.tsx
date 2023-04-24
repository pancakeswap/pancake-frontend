import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const { t } = useTranslation()
  const isStableSwap = router.query.type === 'stableSwap'

  return (
    <>
      <SubMenuItems
        items={[
          {
            label: t('V3'),
            href: `/info/v3${chainPath}`,
          },
          {
            label: t('V2'),
            href: `/info${chainPath}`,
          },
          chainName === 'BSC' && {
            label: t('StableSwap'),
            href: '/info?type=stableSwap',
          },
        ]}
        activeItem={isStableSwap ? '/info?type=stableSwap' : `/info${chainPath}`}
      />

      <InfoNav isStableSwap={isStableSwap} />
      {children}
    </>
  )
}
