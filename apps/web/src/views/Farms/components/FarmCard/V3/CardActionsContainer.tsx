import { Farm as FarmUI, useModalV2 } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useMemo } from 'react'
import styled from 'styled-components'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { V3Farm } from 'views/Farms/FarmsV3'
import FarmInfo from './FarmInfo'

const { NoPosition } = FarmUI.FarmV3Card

const Action = styled.div`
  padding-top: 16px;
`

interface FarmCardActionsProps {
  farm: V3Farm
  account?: string
  lpLabel?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({ farm, account }) => {
  const { multiplier, stakedPositions, unstakedPositions } = farm
  const isReady = multiplier !== undefined
  const inactive = isReady && multiplier === '0X'

  const hasNoPosition = useMemo(
    () => stakedPositions.length === 0 && unstakedPositions.length === 0,
    [stakedPositions, unstakedPositions],
  )

  const addLiquidityModal = useModalV2()

  return (
    <Action>
      <AddLiquidityV3Modal
        {...addLiquidityModal}
        currency0={unwrappedToken(farm.token)}
        currency1={unwrappedToken(farm.quoteToken)}
        feeAmount={farm.feeAmount}
      />
      {account && !hasNoPosition ? (
        <FarmInfo farm={farm} isReady={isReady} onAddLiquidity={addLiquidityModal.onOpen} />
      ) : (
        <NoPosition
          inactive={inactive}
          account={account}
          hasNoPosition={hasNoPosition}
          onAddLiquidityClick={addLiquidityModal.onOpen}
          connectWalletButton={<ConnectWalletButton mt="8px" width="100%" />}
        />
      )}
    </Action>
  )
}

export default CardActions
