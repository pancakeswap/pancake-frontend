import { ChainId } from '@pancakeswap/sdk'
import { ACCESS_RISK_API } from 'config/constants/endpoints'

import { z } from 'zod'

const zBand = z.enum(['5/5', '4/5', '3/5', '2/5', '1/5'])
export const zRiskTokenData = z.object({
  trust_level: z.string(),
  band: zBand,
  scanned_ts: z.string(),
})

export enum TOKEN_RISK {
  'Low' = 'Low',
  'Medium' = 'Medium',
  'High' = 'High',
}

export const TokenRiskPhases = {
  '5/5': TOKEN_RISK.Low,
  '4/5': TOKEN_RISK.Medium,
  '3/5': TOKEN_RISK.Medium,
  '2/5': TOKEN_RISK.Medium,
  '1/5': TOKEN_RISK.High,
}

export interface RiskTokenInfo {
  address: string
  chainId: ChainId
  riskLevel: TOKEN_RISK
  scannedTs: number
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
  const data = zRiskTokenData.parse(riskApi.data)
  // eslint-disable-next-line camelcase
  const { band, scanned_ts } = data
  console.log(band, 'band')

  return {
    address,
    chainId,
    riskLevel: TokenRiskPhases[band],
    scannedTs: parseInt(scanned_ts, 10),
  }
}
