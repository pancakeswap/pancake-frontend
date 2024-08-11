import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, AutoRow, Button, IconButton, MinusIcon } from '@pancakeswap/uikit'
import { useCallback } from 'react'

type StakeActionsProps = {
  decreaseDisabled?: boolean
  onIncrease: () => void
  onDecrease?: () => void
}

export const ModifyStakeActions: React.FC<StakeActionsProps> = ({
  decreaseDisabled = false,
  onIncrease,
  onDecrease,
}) => {
  return (
    <AutoRow gap="sm">
      <IconButton variant="secondary" disabled={decreaseDisabled} onClick={onDecrease}>
        <MinusIcon color="primary" width="24px" />
      </IconButton>
      <IconButton variant="secondary" onClick={onIncrease}>
        <AddIcon color="primary" width="24px" />
      </IconButton>
    </AutoRow>
  )
}

type DepositStakeActionsProps = {
  disabled: boolean
  onDeposit: () => void
}
export const DepositStakeActions: React.FC<DepositStakeActionsProps> = ({ disabled, onDeposit }) => {
  const { t } = useTranslation()
  return (
    <Button onClick={onDeposit} disabled={disabled}>
      {t('Stake LP')}
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

// type V2LiquidityActionsProps = {
//   stakedBalance: BigNumber
// }
// export const V2ModifyStakeActions: React.FC<V2LiquidityActionsProps> = ({
//   stakedBalance,
//   lpAddress,
// }) => {
//   const { } = useStakedActions(lpAddress, pid)
//   const [onDecrease] = useModal(
//     <FarmWidget.WithdrawModal
//       showActiveBooster={false}
//       max={stakedBalance ?? BIG_ZERO}
//       onConfirm={handleDecrease}
//       tokenName={tokenName}
//       showCrossChainFarmWarning={false}
//       decimals={18}
//     />
//   )
//   const [onIncrease] = useModal()

//   return (
//     <ModifyStakeActions onIncrease={onIncrease} onDecrease={onDecrease} />
//   )
// }
