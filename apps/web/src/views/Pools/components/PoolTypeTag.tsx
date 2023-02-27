import { useTranslation } from '@pancakeswap/localization'
import { useTooltip, Farm as FarmUI } from '@pancakeswap/uikit'

const { CompoundingPoolTag, ManualPoolTag, LockedPoolTag, LockedOrAutoPoolTag } = FarmUI.Tags

const PoolTypeTag = ({ account, vaultKey, isLocked, children }) => {
  const { t } = useTranslation()

  let tooltipText

  if (!vaultKey) {
    tooltipText = t('You must harvest and compound your earnings from this pool manually.')
  } else if (!account) {
    tooltipText = t(
      'In flexible staking, rewards are distributed and included in your total staking balance. In locked staking, Rewards are locked until the end of the staking position.',
    )
  } else if (isLocked) {
    tooltipText = t('Rewards are locked until the end of the staking position.')
  } else {
    tooltipText = t('Rewards are distributed and included in your total staking balance.')
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipText, {
    placement: 'bottom',
  })

  return (
    <>
      {vaultKey ? (
        account ? (
          isLocked ? (
            <LockedPoolTag />
          ) : (
            <CompoundingPoolTag />
          )
        ) : (
          <LockedOrAutoPoolTag />
        )
      ) : (
        <ManualPoolTag />
      )}
      {tooltipVisible && tooltip}
      {children(targetRef)}
    </>
  )
}

export default PoolTypeTag
