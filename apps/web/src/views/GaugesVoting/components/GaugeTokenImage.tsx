import {
  GaugeALMConfig,
  GaugeConfig,
  GaugeStableSwapConfig,
  GaugeType,
  GaugeV2Config,
  GaugeV3Config,
} from '@pancakeswap/gauges'
import { Token } from '@pancakeswap/swap-sdk-core'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Address } from 'viem'

type Props = {
  size?: number
  margin?: string
}

const GaugeSingleTokenImage = ({ size = 32 }: Props) => {
  return (
    <img
      src="/images/cake-staking/token-vecake.png"
      alt="ve-cake"
      width={size}
      height={size}
      style={{ maxHeight: `${size}px` }}
    />
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const GaugeDoubleTokenImage: React.FC<
  { gaugeConfig: GaugeV2Config | GaugeV3Config | GaugeALMConfig | GaugeStableSwapConfig } & Props
> = ({ gaugeConfig, size = 32, margin = '4px' }) => {
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
  const currency0 = useMemo<Token | undefined>(() => {
    if (token0Address) return new Token(Number(gaugeConfig.chainId), token0Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, token0Address])
  const currency1 = useMemo((): Token | undefined => {
    if (token1Address) return new Token(Number(gaugeConfig.chainId), token1Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, token1Address])

  return (
    <Wrapper>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: margin }} />}
      {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />}
    </Wrapper>
  )
}

export const GaugeTokenImage: React.FC<
  {
    gauge?: GaugeConfig
  } & Props
> = ({ gauge, size, margin }) => {
  if (!gauge) return null

  if (gauge?.type === GaugeType.VeCakePool) {
    return <GaugeSingleTokenImage size={size} />
  }

  return <GaugeDoubleTokenImage gaugeConfig={gauge} size={size} margin={margin} />
}
