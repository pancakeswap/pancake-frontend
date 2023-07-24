/* eslint-disable camelcase */
import { ChainId } from '@pancakeswap/sdk'
import { ACCESS_RISK_API } from 'config/constants/endpoints'

export const TOKEN_RISK = {
  UNKNOWN: -1,
  SOME_RISK: 0,
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  SIGNIFICANT: 5,
} as const

export interface RiskTokenInfo {
  address: string
  chainId: ChainId
  isSuccess: boolean
  riskLevel: number
  requestId: string
  riskLevelDescription: string
}

const fetchRiskApi = async (address: string, chainId: number) => {
  const response = await fetch(ACCESS_RISK_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      chain_id: chainId,
    }),
  })

  const result = await response.json()
  return result
}

export const fetchRiskToken = async (address: string, chainId: number): Promise<RiskTokenInfo> => {
  const riskApi = await fetchRiskApi(address, chainId)
  const { has_result, request_id, risk_level, risk_level_description } = riskApi.data

  return {
    address,
    chainId,
    isSuccess: has_result,
    riskLevel: risk_level,
    requestId: request_id,
    riskLevelDescription: risk_level_description,
  }
}
