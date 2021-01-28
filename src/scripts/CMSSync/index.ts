import fs from 'fs'
import { parseISO, format } from 'date-fns'

import { Ifo, PoolConfig, FarmConfig } from '../../config/constants/types'
import api from '../api'
import settings from './settings'
import { SettingsObject } from './types'

const getIfos = (data) => {
  const ifos: Ifo = data.map((ifo) => {
    const lunchTime2 = parseISO(ifo.launch_datetime)
    return {
      id: ifo._id,
      isActive: ifo.is_active,
      address: ifo.address,
      name: ifo.name,
      subTitle: ifo?.sub_title,
      description: ifo?.description,
      launchDate: format(lunchTime2, 'yyyy-MM-dd'),
      launchTime: format(lunchTime2, 'HH:mm:ss'),
      saleAmount: ifo.sale_amount,
      raiseAmount: ifo.raise_amount,
      cakeToBurn: ifo.burn_amount,
      projectSiteUrl: ifo.project_url,
      currency: ifo.currency,
      currencyAddress: ifo.currency_address,
      tokenDecimals: ifo.decimals,
      releaseBlockNumber: ifo.__v,
    }
  })
  return ifos
}

const getPools = (data) => {
  const pools: PoolConfig = data.map((pool) => {
    return {
      sousId: pool._id,
      // image: string,
      tokenName: pool?.token?.name,
      stakingTokenName: pool?.quote_token?.name,
      stakingLimit: pool?.quote_token?.decimals,
      stakingTokenAddress: pool?.quote_token?.mainnet_address,
      contractAddress: pool.contract_address,
      poolCategory: pool.category,
      projectLink: pool.project_url,
      tokenPerBlock: pool.token_per_block,
      sortOrder: pool.ranking,
      harvest: pool.harvest,
      isFinished: pool.is_finished,
      tokenDecimals: pool?.token?.decimals,
    }
  })
  return pools
}

const getFarms = (data) => {
  const farms: FarmConfig = data.map((farm) => {
    return {
      pid: farm.pid,
      lpSymbol: farm.lp_symbol,
      lpAddresses: farm.lp_mainnet_address,
      tokenSymbol: farm?.token?.symbol,
      tokenAddresses: farm?.token?.mainnet_address,
      quoteTokenSymbol: farm?.quote_token?.symbol,
      quoteTokenAdresses: farm?.quote_token?.mainnet_address,
      multiplier: farm?.multiplier,
      isCommunity: farm?.is_community,
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
  console.info(` ✅ - ${item.name}`)
  api(item.link).then((res) => {
    const [, secondKey] = Object.keys(res)
    const formattedData = getFormattedData(item.type, res[secondKey])
    fs.writeFileSync(`src/config/constants/${item.name}.json`, JSON.stringify(formattedData, undefined, 2))
  })
})
