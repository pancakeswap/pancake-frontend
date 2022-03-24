import React from 'react'
import { LiquidityProvider, useLiquidity, LiquidityPage } from './liquidityContext'
import Pool from '../../Pool/index'
import AddLiquidity from '../../AddLiquidity/bmp/index'
import RemoveLiquidity from '../../RemoveLiquidity/index'
import FindPool from '../../PoolFinder/index'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'

const LiquidityWrapper = () => {
  const {
    state: { page },
  } = useLiquidity()
  switch (page) {
    case LiquidityPage.Pool:
      return <Pool />
    case LiquidityPage.Add:
      return <AddLiquidity />
    case LiquidityPage.Remove:
      return <RemoveLiquidity />
    case LiquidityPage.Find:
      return <FindPool />
    default:
      return null
  }
}

const LiquidityHome = () => {
  return (
    <BmpPage activeId={ActiveId.LIQUIDITY}>
      <LiquidityProvider>
        <LiquidityWrapper />
      </LiquidityProvider>
    </BmpPage>
  )
}
export default LiquidityHome
