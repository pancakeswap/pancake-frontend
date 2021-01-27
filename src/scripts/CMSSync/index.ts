import fs from 'fs'
import moment from 'moment'

import api from '../api'
import settings from './settings'
import { Ifo, PoolConfig, FarmConfig } from '../../config/constants/types'
import { SettingsObject } from './types'

const getIfos = (data) => {
  const ifos: Ifo = data.map((obj) => {
    const lunchTime = moment(obj.launch_datetime)
    return {
      id: obj._id,
      isActive: obj.is_active,
      address: obj.address,
      name: obj.name,
      subTitle: obj?.sub_title,
      description: obj?.description,
      launchDate: lunchTime.format('YYYY-MM-DD'),
      launchTime: lunchTime.format('h:mm:ss'),
      saleAmount: obj.sale_amount,
      raiseAmount: obj.raise_amount,
      cakeToBurn: obj.burn_amount,
      projectSiteUrl: obj.project_url,
      currency: obj.currency,
      currencyAddress: obj.currency_address,
      tokenDecimals: obj.decimals,
      releaseBlockNumber: obj.__v,
    }
  })
  return ifos
}

const getPools = (data) => {
  const pools: PoolConfig = data.map((obj) => {
    return {
      sousId: obj._id,
      // image: string,
      tokenName: obj?.token?.name,
      stakingTokenName: obj?.quote_token?.name,
      stakingLimit: obj?.quote_token?.decimals,
      stakingTokenAddress: obj?.quote_token?.mainnet_address,
      contractAddress: obj.contract_address,
      poolCategory: obj.category,
      projectLink: obj.project_url,
      tokenPerBlock: obj.token_per_block,
      sortOrder: obj.ranking,
      harvest: obj.harvest,
      isFinished: obj.is_finished,
      tokenDecimals: obj?.token?.decimals,
    }
  })
  return pools
}

const getFarms = (data) => {
  const farms: FarmConfig = data.map((obj) => {
    return {
      pid: obj.pid,
      lpSymbol: obj.lp_symbol,
      lpAddresses: obj.lp_mainnet_address,
      tokenSymbol: obj?.token?.symbol,
      tokenAddresses: obj?.token?.mainnet_address,
      quoteTokenSymbol: obj?.quote_token?.symbol,
      quoteTokenAdresses: obj?.quote_token?.mainnet_address,
      multiplier: obj?.multiplier,
      isCommunity: obj?.is_community,
      // dual: {
      //   rewardPerBlock: obj
      //   earnLabel: obj
      //   endBlock: obj
      // }
    }
  })
  return farms
}

const getFormattedData = (type, data) => {
  const handler = {
    IFO: () => getIfos(data),
    POOL: () => getPools(data),
    FARM: () => getFarms(data),
  }

  const factory = () => {
    if (Object.prototype.hasOwnProperty.call(handler, type)) {
      return handler[type]()
    }

    return 'Unkown element'
  }

  return factory()
}

settings.forEach((item: SettingsObject) => {
  console.log(` ✅ - ${item.name}`)
  api(item.link).then((res) => {
    const secondKey = Object.keys(res)[1]
    const formattedData = getFormattedData(item.type, res[secondKey])
    fs.writeFileSync(`src/config/constants/${item.name}.json`, JSON.stringify(formattedData))
  })
})
