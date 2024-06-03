import { DeserializedFarm, FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'

export interface V3FarmWithoutStakedValue extends FarmV3DataWithPriceAndUserInfo {
  version: 3
}

export interface V2FarmWithoutStakedValue extends DeserializedFarm {
  version: 2
}
