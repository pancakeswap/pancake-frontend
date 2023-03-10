import { Farm as FarmUI } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useMemo } from 'react'
import styled from 'styled-components'
import { V3Farm } from 'views/Farms/FarmsV3'
import FarmInfo from './FarmInfo'

const { NoPosition } = FarmUI.FarmV3Card

const Action = styled.div`
  padding-top: 16px;
`

interface FarmCardActionsProps {
  farm: V3Farm
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({ farm, account, addLiquidityUrl }) => {
  const { multiplier, stakedPositions, unstakedPositions } = farm
  const isReady = multiplier !== undefined

  const hasNoPosition = useMemo(
    () => stakedPositions.length === 0 && unstakedPositions.length === 0,
    [stakedPositions, unstakedPositions],
  )

  return (
    <Action>
      {account && !hasNoPosition ? (
        <FarmInfo farm={farm} isReady={isReady} liquidityUrlPathParts={addLiquidityUrl} />
      ) : (
        <NoPosition
          account={account}
          hasNoPosition={hasNoPosition}
          liquidityUrlPathParts={addLiquidityUrl}
          connectWalletButton={<ConnectWalletButton mt="8px" width="100%" />}
        />
      )}
    </Action>
  )
}

export default CardActions
