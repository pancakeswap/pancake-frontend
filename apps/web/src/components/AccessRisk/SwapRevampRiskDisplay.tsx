import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { ERC20Token } from '@pancakeswap/sdk'
import { Flex, FlexGap, Link, RiskAlertIcon, Text } from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo } from 'react'

import { TOKEN_RISK, TOKEN_RISK_T, useTokenRisk } from './index'

interface RiskInputPanelDisplayProps {
  token?: ERC20Token
}

interface RiskDetailsProps {
  token?: ERC20Token
  riskLevelDescription?: string
}

const useRiskCheckData = (token?: ERC20Token) => {
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
  return { isDataLoading, riskLevel, tagColor }
}

export const RiskInputPanelDisplay: React.FC<RiskInputPanelDisplayProps> = ({ token }) => {
  const { isDataLoading, riskLevel, tagColor } = useRiskCheckData(token)
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

export const RiskDetails: React.FC<RiskDetailsProps> = ({ token, riskLevelDescription }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDataLoading, riskLevel, tagColor } = useRiskCheckData(token)
  if (!isDataLoading && riskLevel && riskLevel <= TOKEN_RISK.SIGNIFICANT && riskLevel >= TOKEN_RISK.MEDIUM) {
    if (riskLevel && riskLevel >= TOKEN_RISK.VERY_LOW && token?.address) {
      return (
        <>
          <Text my="8px">{riskLevelDescription}</Text>
          <Text as="span">{t('Risk scan results are provided by a third party,')}</Text>
          <Link style={{ display: 'inline' }} ml="4px" external href="https://www.hashdit.io">
            HashDit
          </Link>
          {chainId === ChainId.BSC && (
            <Flex mt="4px">
              <Text>{t('Get more details from')}</Text>
              <Link ml="4px" external href={`https://dappbay.bnbchain.org/risk-scanner/${token?.address ?? ''}`}>
                {t('RedAlarm')}
              </Link>
            </Flex>
          )}
        </>
      )
    }
  }
  return null
}
