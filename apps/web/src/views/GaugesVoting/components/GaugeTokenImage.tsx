import { Token } from '@pancakeswap/swap-sdk-core'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import { GaugeALMConfig, GaugeConfig, GaugeType, GaugeV2Config, GaugeV3Config } from 'config/constants/types'
import { useMemo } from 'react'
import { Address } from 'viem'

const GaugeSingleTokenImage = () => {
  return <img src="/images/cake-staking/token-vecake.png" alt="ve-cake" width="32px" height="32px" />
}

const GaugeDoubleTokenImage: React.FC<{ gaugeConfig: GaugeV2Config | GaugeV3Config | GaugeALMConfig }> = ({
  gaugeConfig,
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

  return <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
}

export const GaugeTokenImage: React.FC<{
  gauge?: GaugeConfig
}> = ({ gauge }) => {
  if (!gauge) return null

  if (gauge?.type === GaugeType.VeCakePool) {
    return <GaugeSingleTokenImage />
  }

  return <GaugeDoubleTokenImage gaugeConfig={gauge} />
}
