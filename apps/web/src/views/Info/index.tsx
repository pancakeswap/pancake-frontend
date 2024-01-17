import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { multiChainQueryStableClient } from 'state/info/constant'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const { t } = useTranslation()
  const isStableSwap = router.query.type === 'stableSwap'
  const subMenuItems = useMemo(
    () => [
      {
        label: t('V3'),
        href: `/info/v3${chainPath}`,
      },
      {
        label: t('V2'),
        href: `/info${chainPath}`,
      },
      Boolean(multiChainQueryStableClient[chainName]) && {
        label: t('StableSwap'),
        href: `/info${chainPath}?type=stableSwap`,
      },
    ],
    [t, chainPath, chainName],
  )

  return (
    <>
      <SubMenuItems
        items={subMenuItems}
        activeItem={isStableSwap ? `/info${chainPath}?type=stableSwap` : `/info${chainPath}`}
      />

      <InfoNav isStableSwap={isStableSwap} />
      {children}
    </>
  )
}
