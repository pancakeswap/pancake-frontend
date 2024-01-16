import { getBoostedPoolConfig } from '@pancakeswap/pools'
import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/widgets-internal'
import { vaultPoolConfig } from 'config/constants/pools'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCurrentBlock } from 'state/block/hooks'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { useBoostedPoolApr } from 'views/Pools/hooks/useBoostedPoolApr'
import { useAccount } from 'wagmi'

const withShownApr = (AprComp) => (props) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const currentBlock = useCurrentBlock()

  const { shouldShowBlockCountdown, hasPoolStarted } = getPoolBlockInfo(props.pool, currentBlock)

  const autoCompoundFrequency = vaultPoolConfig[props.pool.vaultKey]?.autoCompoundFrequency ?? 0

  const boostedApr = useBoostedPoolApr({
    chainId,
    enabled: !props.pool.isFinished,
    contractAddress: props.pool.contractAddress,
  })

  const boostedPoolConfig = chainId && getBoostedPoolConfig(chainId, props.pool.contractAddress)
  return (
    <AprComp
      {...props}
      shouldShowApr={hasPoolStarted || !shouldShowBlockCountdown}
      account={account}
      boostedApr={boostedApr}
      boostedTooltipsText={boostedPoolConfig ? boostedPoolConfig.tooltipsText : ''}
      autoCompoundFrequency={autoCompoundFrequency}
    />
  )
}

export default withShownApr(Pool.Apr<Token>)
