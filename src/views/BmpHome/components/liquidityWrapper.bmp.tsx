import React from 'react'
import { useLiquidity, LiquidityPage } from '../context/swapContext.bmp'
import Pool from '../../Pool/index'
import AddLiquidity from '../../AddLiquidity/bmp/index'
import RemoveLiquidity from '../../RemoveLiquidity/index'
import FindPool from '../../PoolFinder/index'
export const LiquidityWrapper = () => {
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
