import { Token } from '@pancakeswap/swap-sdk-core'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import { GaugeALMConfig, GaugeConfig, GaugeType, GaugeV2Config, GaugeV3Config } from 'config/constants/types'
import { useMemo } from 'react'
import { Address } from 'viem'

type Props = {
  size?: number
}

const GaugeSingleTokenImage = ({ size = 32 }: Props) => {
  return <img src="/images/cake-staking/token-vecake.png" alt="ve-cake" width={size} height={size} />
}

const GaugeDoubleTokenImage: React.FC<{ gaugeConfig: GaugeV2Config | GaugeV3Config | GaugeALMConfig } & Props> = ({
  gaugeConfig,
  size = 32,
}) => {
  const currency0 = useMemo<Token | undefined>(() => {
    if (gaugeConfig.token0Address)
      return new Token(Number(gaugeConfig.chainId), gaugeConfig.token0Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, gaugeConfig.token0Address])
  const currency1 = useMemo((): Token | undefined => {
    if (gaugeConfig.token1Address)
      return new Token(Number(gaugeConfig.chainId), gaugeConfig.token1Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, gaugeConfig.token1Address])

  return <DoubleCurrencyLogo size={size} currency0={currency0} currency1={currency1} />
}

export const GaugeTokenImage: React.FC<
  {
    gauge?: GaugeConfig
  } & Props
> = ({ gauge, size }) => {
  if (!gauge) return null

  if (gauge?.type === GaugeType.VeCakePool) {
    return <GaugeSingleTokenImage size={size} />
  }

  return <GaugeDoubleTokenImage gaugeConfig={gauge} size={size} />
}
