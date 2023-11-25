import { useTranslation } from '@pancakeswap/localization'

export default function LockedAprTooltipContent() {
  const { t } = useTranslation()
  return <>{t('To continue receiving CAKE rewards, please migrate your Fixed-Term Staking CAKE Balance to veCAKE')}</>
}
