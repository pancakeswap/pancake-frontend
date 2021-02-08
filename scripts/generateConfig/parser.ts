import { parseISO, format } from 'date-fns'
import { Ifo, PoolConfig, FarmConfig } from '../../src/config/constants/types'
import { SettingsType } from './types'

export const getIfos = (data) => {
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
      releaseBlockNumber: ifo.release_block,
    }
  })
  return ifos
}

export const getPools = (data) => {
  const pools: PoolConfig = data.map((pool) => {
    return {
      sousId: pool._id,
      tokenName: pool?.token?.name,
      stakingTokenName: pool?.quote_token?.name,
      stakingLimit: pool?.quote_token?.decimals,
      stakingTokenAddress: pool?.quote_token?.mainnet_address,
      contractAddress: {
        56: pool.contract_address,
        97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      },
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

export const getFarms = (data) => {
  const farms: FarmConfig = data.map((farm) => {
    return {
      pid: farm.pid,
      lpSymbol: farm.lp_symbol,
      lpAddresses: {
        56: farm.lp_mainnet_address,
        97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      },
      tokenSymbol: farm?.token?.symbol,
      tokenAddresses: {
        56: farm?.token?.mainnet_address,
        97: '0xa35062141fa33bca92ce69fed37d0e8908868aae',
      },
      quoteTokenSymbol: farm?.quote_token?.symbol,
      quoteTokenAdresses: farm?.quote_token?.mainnet_address,
      isCommunity: farm?.is_community,
    }
  })
  return farms
}

export const getFormattedData = (type: SettingsType, data) => {
  const handler = {
    IFO: () => getIfos(data),
    POOL: () => getPools(data),
    FARM: () => getFarms(data),
  }

  const factory = () => {
    return handler[type]()
  }

  return factory()
}
