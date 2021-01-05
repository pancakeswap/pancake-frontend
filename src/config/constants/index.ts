import farmsConfig from './farms'

const communityFarms = farmsConfig.filter((farm) => farm.isCommunity).map((farm) => farm.tokenSymbol)

export { farmsConfig, communityFarms }
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
