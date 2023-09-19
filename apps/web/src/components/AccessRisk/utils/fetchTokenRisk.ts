/* eslint-disable camelcase */
import { ChainId } from '@pancakeswap/chains'
import { ACCESS_RISK_API } from 'config/constants/endpoints'

export interface RiskTokenInfo {
  address: string
  chainId: ChainId
  hasResult: boolean
  riskLevel: number
  requestId: string
  riskLevelDescription: string
  pollingInterval: number
  isError: boolean
}

const fetchRiskApi = async (address: string, chainId: number) => {
  const response = await fetch(`${ACCESS_RISK_API}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      chain_id: chainId,
      address,
    }),
  })

  const result = await response.json()

  return {
    ...result,
    data: {
      address,
      chainId,
      isError: response.status !== 200,
      hasResult: result.data.has_result,
      riskLevel: result.data.risk_level,
      requestId: result.data.request_id,
      riskLevelDescription: result.data.risk_level_description,
      pollingInterval: result.data?.polling_interval ?? 0,
    },
  }
}

export const fetchRiskToken = async (address: string, chainId: number): Promise<RiskTokenInfo> => {
  const riskApi = await fetchRiskApi(address, chainId)
  if (riskApi?.data && !riskApi?.data?.isError) {
    return riskApi.data
  }

  return {
    address,
    chainId,
    isError: true,
    hasResult: false,
    riskLevel: -1,
    requestId: '',
    riskLevelDescription: '',
    pollingInterval: 0,
  }
}
