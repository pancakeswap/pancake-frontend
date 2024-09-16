import { ERC20Token } from '@pancakeswap/sdk'
import { FlexGap, RiskAlertIcon, Text } from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useEffect, useMemo } from 'react'
import { TOKEN_RISK, TOKEN_RISK_T, useTokenRisk } from './index'

interface RiskInputPanelDisplayProps {
  token?: ERC20Token
}

export const RiskInputPanelDisplay: React.FC<RiskInputPanelDisplayProps> = ({ token }) => {
  const { data, refetch } = useTokenRisk(token)

  useEffect(() => {
    if (data?.pollingInterval) {
      const refresh = setTimeout(() => refetch(), data?.pollingInterval)
      return () => clearTimeout(refresh)
    }
    return undefined
  }, [data?.pollingInterval, refetch])
  const isDataLoading = useMemo(() => !data || (data?.riskLevel === TOKEN_RISK.UNKNOWN && !data?.hasResult), [data])

  const riskLevel = useMemo(() => {
    if (!isUndefinedOrNull(data?.riskLevel)) {
      if (data?.riskLevel) {
        return data?.riskLevel
      }
      return TOKEN_RISK.UNKNOWN
    }
    return undefined
  }, [data])

  const tagColor = useMemo(() => {
    if (!data?.riskLevel) {
      return 'textDisabled'
    }
    if (data.riskLevel > TOKEN_RISK.MEDIUM) {
      return 'failure'
    }
    if (data.riskLevel >= TOKEN_RISK.LOW && data.riskLevel <= TOKEN_RISK.MEDIUM) {
      return 'warning'
    }
    if (data.riskLevel >= TOKEN_RISK.VERY_LOW && data.riskLevel <= TOKEN_RISK.SOME_RISK) {
      return 'primary'
    }
    return 'textDisabled'
  }, [data?.riskLevel])
  if (!isDataLoading && riskLevel && riskLevel <= TOKEN_RISK.SIGNIFICANT && riskLevel >= TOKEN_RISK.MEDIUM)
    return (
      <FlexGap justifyContent="center" alignContent="center">
        <RiskAlertIcon width={16} color={tagColor} />
        <Text fontSize="12px" color={tagColor}>
          {TOKEN_RISK_T[riskLevel]}
        </Text>
      </FlexGap>
    )
  return null
}
