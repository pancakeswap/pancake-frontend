import { ChainId } from '@pancakeswap/sdk'
import { ACCESS_RISK_API } from 'config/constants/endpoints'

export enum TOKEN_RISK {
  'Low' = 'Low',
  'Medium' = 'Medium',
  'High' = 'High',
}

export const TokenRiskPhases = {
  0: TOKEN_RISK.Low,
  1: TOKEN_RISK.Medium,
  2: TOKEN_RISK.Medium,
  3: TOKEN_RISK.Medium,
  4: TOKEN_RISK.High,
  5: TOKEN_RISK.High,
}

export interface RiskTokenInfo {
  address: string
  chainId: ChainId
  isSuccess: boolean
  riskLevel: TOKEN_RISK
  riskResult: string
  scannedTs: number
}

export const fetchRiskToken = async (address: string, chainId: number): Promise<RiskTokenInfo> => {
  try {
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

    return {
      isSuccess: true,
      address,
      chainId,
      riskLevel: TokenRiskPhases[result.risk_level],
      riskResult: result.risk_result,
      scannedTs: result.scanned_ts,
    }
  } catch (error) {
    return {
      isSuccess: false,
      address: '',
      chainId: ChainId.BSC,
      riskLevel: TokenRiskPhases[0],
      riskResult: '',
      scannedTs: 0,
    }
  }
}
