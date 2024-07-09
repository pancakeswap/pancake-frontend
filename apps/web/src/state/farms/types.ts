import { DeserializedFarm, FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'

export interface V3FarmWithoutStakedValue extends FarmV3DataWithPriceAndUserInfo {
  version: 3
}

export interface V2FarmWithoutStakedValue extends DeserializedFarm {
  version: 2
}

export interface V3Farm extends V3FarmWithoutStakedValue {
  version: 3
}
