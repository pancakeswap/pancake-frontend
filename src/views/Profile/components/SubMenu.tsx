import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import BaseSubMenu from '../../Nft/market/components/BaseSubMenu'

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const accountAddress = router.query.accountAddress as string
  const { asPath } = router

  const ItemsConfig = [
    {
      label: t('Items'),
      href: `/profile/${accountAddress}`,
    },
    {
      label: t('Activity'),
      href: `/profile/${accountAddress}/activity`,
    },
  ]

  return <BaseSubMenu items={ItemsConfig} activeItem={asPath} justifyContent="flex-start" mb="60px" />
}

export default SubMenuComponent
