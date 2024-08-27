import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, IconButton, MinusIcon } from '@pancakeswap/uikit'
import { useCallback } from 'react'

type StakeActionsProps = {
  increaseDisabled?: boolean
  decreaseDisabled?: boolean
  showIncreaseBtn?: boolean
  showDecreaseBtn?: boolean
  onIncrease: () => void
  onDecrease?: () => void
}

export const ModifyStakeActions: React.FC<StakeActionsProps> = ({
  increaseDisabled = false,
  decreaseDisabled = false,
  showIncreaseBtn = true,
  showDecreaseBtn = true,
  onIncrease,
  onDecrease,
}) => {
  return (
    <>
      {showDecreaseBtn && (
        <IconButton variant="secondary" disabled={decreaseDisabled} onClick={onDecrease}>
          <MinusIcon color="primary" width="24px" />
        </IconButton>
      )}
      {showIncreaseBtn && (
        <IconButton variant="secondary" disabled={increaseDisabled} onClick={onIncrease}>
          <AddIcon color="primary" width="24px" />
        </IconButton>
      )}
    </>
  )
}

type DepositStakeActionsProps = {
  disabled?: boolean
  onDeposit: () => void
}
export const DepositStakeAction: React.FC<DepositStakeActionsProps> = ({ disabled, onDeposit }) => {
  const { t } = useTranslation()
  return (
    <Button onClick={onDeposit} disabled={disabled}>
      {t('Stake LP')}
    </Button>
  )
}

type HarvestActionsProps = {
  onHarvest: () => void
  executing?: boolean
  disabled?: boolean
}
export const HarvestAction: React.FC<HarvestActionsProps> = ({ onHarvest, executing, disabled }) => {
  const { t } = useTranslation()
  return (
    <Button disabled={disabled} onClick={onHarvest}>
      {executing ? t('Harvesting') : t('Harvest')}
    </Button>
  )
}

export const getV3LiquidityActionLink = (
  direction: 'increase' | 'decrease',
  token0Address: string,
  token1Address: string,
  fee: number,
  tokenId: string,
) => {
  return `/${direction}/${token0Address}/${token1Address}/${fee}/${tokenId}`
}
type V3LiquidityActionsProps = {
  decreaseDisabled?: boolean
  increaseLink: string
  decreaseLink: string
}
export const V3ModifyStakeActions: React.FC<V3LiquidityActionsProps> = ({
  decreaseDisabled = false,
  increaseLink,
  decreaseLink,
}) => {
  const onDecrease = useCallback(() => {
    window.open(decreaseLink, '_blank', 'noopener')
  }, [decreaseLink])
  const onIncrease = useCallback(() => {
    window.open(increaseLink, '_blank', 'noopener')
  }, [increaseLink])

  return <ModifyStakeActions decreaseDisabled={decreaseDisabled} onIncrease={onIncrease} onDecrease={onDecrease} />
}
