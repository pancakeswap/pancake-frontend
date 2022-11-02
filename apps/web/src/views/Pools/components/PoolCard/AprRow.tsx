import { Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Apr from 'views/Pools/components/Apr'
import { Token } from '@pancakeswap/sdk'

interface AprRowProps {
  pool: Pool.DeserializedPool<Token>
  stakedBalance: BigNumber
  performanceFee?: number
  showIcon?: boolean
  vaultKey?: boolean
}

const AprRow: React.FC<React.PropsWithChildren<AprRowProps>> = ({
  pool,
  stakedBalance,
  performanceFee = 0,
  showIcon = true,
}) => {
  return (
    <Pool.AprRowWithToolTip isVaultKey={Boolean(pool.vaultKey)}>
      <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon={showIcon} />
    </Pool.AprRowWithToolTip>
  )
}

export default AprRow
