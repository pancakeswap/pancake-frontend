import { Pool } from '@pancakeswap/widgets-internal'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCurrentBlock } from 'state/block/hooks'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { Token } from '@pancakeswap/sdk'
import { useAccount } from 'wagmi'
// import { fetchAlpBoostedPoolApr } from 'utils/fetchAlpBoostedPoolApr'

const withShownApr = (AprComp) => (props) => {
  const { address: account } = useAccount()

  const currentBlock = useCurrentBlock()

  const { shouldShowBlockCountdown, hasPoolStarted } = getPoolBlockInfo(props.pool, currentBlock)

  const autoCompoundFrequency = vaultPoolConfig[props.pool.vaultKey]?.autoCompoundFrequency ?? 0

  const boostedApr = 1.2
  // await fetchAlpBoostedPoolApr()

  return (
    <AprComp
      {...props}
      shouldShowApr={hasPoolStarted || !shouldShowBlockCountdown}
      account={account}
      boostedApr={boostedApr}
      autoCompoundFrequency={autoCompoundFrequency}
    />
  )
}

export default withShownApr(Pool.Apr<Token>)
