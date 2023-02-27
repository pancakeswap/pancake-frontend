import { useTranslation } from '@pancakeswap/localization'

export default function LockedAprTooltipContent({ boostedYieldAmount }) {
  const { t } = useTranslation()

  return (
    <>
      {t('Boosted yield applies to the original locked amount: %boostedYieldAmount%', { boostedYieldAmount })}
      <br />
      <br />
      {t(
        'Calculated based on current rates and subject to change based on various external variables. It is a rough estimate provided for convenience only, and by no means represents guaranteed returns.',
      )}
    </>
  )
}
