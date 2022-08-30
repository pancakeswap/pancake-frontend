import { ChainId } from '@pancakeswap/sdk'
import { ACCESS_RISK_API } from 'config/constants/endpoints'
import { PANCAKE_EXTENDED } from 'config/constants/lists'

export enum TOKEN_RISK {
  'Low' = 'Low',
  'Medium' = 'Medium',
  'High' = 'High',
}

const VerifyTokensLink = {
  [ChainId.BSC]: PANCAKE_EXTENDED,
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
  riskLevelDescription: string
}

const fetchVerifyTokens = async (chainId: number) => {
  const listUrl = VerifyTokensLink[chainId]
  const getTokenList = (await import('utils/getTokenList')).default
  const response = await getTokenList(listUrl)
  return response.tokens
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
  try {
    const [verifyTokens, riskApi] = await Promise.all([fetchVerifyTokens(chainId), fetchRiskApi(address, chainId)])
    const isVerifyAddress = verifyTokens.find((token) => token.address.toLowerCase() === address.toLowerCase())
    const riskLevel = isVerifyAddress ? TokenRiskPhases[0] : TokenRiskPhases[riskApi.data.risk_level]

    return {
      isSuccess: true,
      address,
      chainId,
      riskLevel,
      riskResult: riskApi.data.risk_result,
      scannedTs: riskApi.data.scanned_ts,
      riskLevelDescription: riskApi.risk_level_description,
    }
  } catch (error) {
    console.error('Fetch Risk Token error: ', error)
    return {
      isSuccess: false,
      address: '',
      chainId: ChainId.BSC,
      riskLevel: TokenRiskPhases[0],
      riskResult: '',
      scannedTs: 0,
      riskLevelDescription: '',
    }
  }
}
