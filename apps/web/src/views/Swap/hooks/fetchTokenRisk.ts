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
  hasResult: boolean
  riskLevel: number
  requestId: string
  riskLevelDescription: string
  pollingInterval: number
  isError: boolean
}

const fetchRiskApi = async (address: string, chainId: number) => {
  const response = await fetch(`${ACCESS_RISK_API}/${chainId}/${address}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()
  return result
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
