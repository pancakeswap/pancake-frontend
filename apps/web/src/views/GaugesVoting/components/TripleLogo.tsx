import { ChainId } from '@pancakeswap/chains'
import {
  GaugeALMConfig,
  GaugeConfig,
  GaugeStableSwapConfig,
  GaugeType,
  GaugeV2Config,
  GaugeV3Config,
} from '@pancakeswap/gauges'
import { Native, Token, WNATIVE } from '@pancakeswap/sdk'
import { ChainLogo, CurrencyLogo } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Address } from 'viem'

const StyledDualLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  flex-shrink: 0;
`

const StyledChainLogo = styled(ChainLogo)`
  margin-left: -0.5em;
`

function getCurrency(chainId: ChainId, address?: Address) {
  if (!address) {
    return undefined
  }
  if (WNATIVE[chainId].address === address) {
    return Native.onChain(chainId)
  }
  return new Token(Number(chainId), address, 18, '', '')
}

const SingleLogo = ({ size = 32 }: { size?: number }) => {
  return <img src="/images/cake-staking/token-vecake.png" alt="ve-cake" width={size} height={size} />
}

const DoubleLogo: React.FC<{
  gaugeConfig: GaugeV2Config | GaugeStableSwapConfig | GaugeV3Config | GaugeALMConfig
  size?: number
}> = ({ gaugeConfig, size = 36 }) => {
  const token0Address = useMemo<Address | undefined>(() => {
    if (gaugeConfig.type === GaugeType.StableSwap) {
      return gaugeConfig.tokenAddresses[0]
    }
    return gaugeConfig.token0Address
  }, [gaugeConfig])
  const token1Address = useMemo<Address | undefined>(() => {
    if (gaugeConfig.type === GaugeType.StableSwap) {
      return gaugeConfig.tokenAddresses[1]
    }
    return gaugeConfig.token1Address
  }, [gaugeConfig])

  const currency0 = useMemo(() => getCurrency(gaugeConfig.chainId, token0Address), [gaugeConfig.chainId, token0Address])
  const currency1 = useMemo(() => getCurrency(gaugeConfig.chainId, token1Address), [gaugeConfig.chainId, token1Address])

  return (
    <>
      {currency0 ? <CurrencyLogo currency={currency0} size={`${size}px`} /> : null}
      {currency1 ? <CurrencyLogo ml="-0.5em" currency={currency1} size={`${size}px`} /> : null}
    </>
  )
}

const TokensLogo: React.FC<{ gaugeConfig?: GaugeConfig; size?: number }> = ({ gaugeConfig, size }) => {
  if (!gaugeConfig) return null

  if (gaugeConfig?.type === GaugeType.VeCakePool) {
    return <SingleLogo size={size} />
  }

  return <DoubleLogo gaugeConfig={gaugeConfig} size={size} />
}

export const TripleLogo: React.FC<{
  gaugeConfig?: GaugeConfig
  chainId?: number
  size?: number
}> = ({ gaugeConfig, chainId, size }) => {
  const chainLogoSize = useMemo(() => size && size * 0.5, [size])

  return (
    <StyledDualLogo>
      <TokensLogo gaugeConfig={gaugeConfig} size={size} />
      {chainId ? <StyledChainLogo chainId={chainId} width={chainLogoSize} height={chainLogoSize} /> : null}
    </StyledDualLogo>
  )
}
