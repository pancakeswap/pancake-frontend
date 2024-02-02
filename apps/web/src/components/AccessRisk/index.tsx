import { Trans, useTranslation } from '@pancakeswap/localization'
import { ERC20Token, Token } from '@pancakeswap/sdk'
import {
  AutoRenewIcon,
  Button,
  Dots,
  Flex,
  HelpIcon,
  IconButton,
  RefreshIcon,
  Tag,
  Text,
  promotedGradient,
  useTooltip,
} from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useQuery } from '@tanstack/react-query'
import AccessRiskTooltips from 'components/AccessRisk/AccessRiskTooltips'
import { ACCESS_TOKEN_SUPPORT_CHAIN_IDS } from 'components/AccessRisk/config/supportedChains'
import { fetchRiskToken } from 'components/AccessRisk/utils/fetchTokenRisk'
import { useEffect, useMemo, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import { styled } from 'styled-components'

const AnimatedButton = styled(Button)`
  animation: ${promotedGradient} 1.5s ease infinite;
  background-size: 1000% 1000%;
`

interface AccessRiskProps {
  token: ERC20Token
}

export const TOKEN_RISK = {
  UNKNOWN: -1,
  VERY_LOW: 0,
  SOME_RISK: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  SIGNIFICANT: 5,
} as const

export const TOKEN_RISK_T = {
  [TOKEN_RISK.VERY_LOW]: <Trans>Very Low Risk</Trans>,
  [TOKEN_RISK.SOME_RISK]: <Trans>Some Risk</Trans>,
  [TOKEN_RISK.LOW]: <Trans>Low Risk</Trans>,
  [TOKEN_RISK.MEDIUM]: <Trans>Medium Risk</Trans>,
  [TOKEN_RISK.HIGH]: <Trans>High Risk</Trans>,
  [TOKEN_RISK.SIGNIFICANT]: <Trans>Significant Risk</Trans>,
  [TOKEN_RISK.UNKNOWN]: <Trans>Unknown Risk</Trans>,
} as const

function RetryRisk({ onClick }: { onClick: () => void }) {
  const [retry, setRetry] = useState(false)
  const { t } = useTranslation()
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }
  const retryTooltip = useTooltip(
    <>
      {t('Risk scanning failed.')} {!retry && t('Press the button to retry.')}
    </>,
    {
      placement: 'auto',
      manualVisible: true,
      trigger: 'hover',
    },
  )
  return (
    <div ref={retryTooltip.targetRef}>
      <IconButton
        ml="4px"
        onClick={() => {
          setRetry(true)
          displayTooltip()
          onClick()
        }}
        data-dd-action-name="Risk scan retry button"
        disabled={retry}
        variant="text"
        size="sm"
        style={{ width: '20px' }}
        height="20px"
      >
        <RefreshIcon color="primary" width="16px" height="16px" />
      </IconButton>
      {isTooltipDisplayed && retryTooltip.tooltip}
    </div>
  )
}

export function useTokenRisk(token?: Token) {
  return useQuery({
    queryKey: ['risk', token?.chainId, token?.address],

    queryFn: () => {
      return token && fetchRiskToken(token.address, token.chainId)
    },

    enabled: Boolean(token && token.address && ACCESS_TOKEN_SUPPORT_CHAIN_IDS.includes(token.chainId)),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}

const AccessRisk: React.FC<AccessRiskProps> = ({ token }) => {
  const [show] = useUserTokenRisk()

  return show && <AccessRiskComponent token={token} />
}

const AccessRiskComponent: React.FC<AccessRiskProps> = ({ token }) => {
  const { t } = useTranslation()

  const { data, refetch } = useTokenRisk(token)

  useEffect(() => {
    if (data?.pollingInterval) {
      const refresh = setTimeout(() => refetch(), data?.pollingInterval)
      return () => clearTimeout(refresh)
    }
    return undefined
  }, [data?.pollingInterval, refetch])

  const lists = useAllLists()
  const tokenInLists = useMemo(() => {
    if (!token?.address) return false
    const tokenLists = Object.values(lists)
      .map((list) => list?.current?.tokens)
      .filter(Boolean)
    if (!tokenLists.length) return null
    return tokenLists.some((tokenInfoList) => {
      return tokenInfoList?.some((tokenInfo) => tokenInfo.address === token.address)
    })
  }, [lists, token?.address])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <AccessRiskTooltips
      riskLevel={data?.riskLevel}
      hasResult={data?.hasResult}
      tokenAddress={data?.address}
      riskLevelDescription={data?.riskLevelDescription}
    />,
    { placement: 'bottom' },
  )

  const isDataLoading = useMemo(() => !data || (data?.riskLevel === TOKEN_RISK.UNKNOWN && !data?.hasResult), [data])

  const riskLevel = useMemo(() => {
    if (!isUndefinedOrNull(data?.riskLevel)) {
      if (tokenInLists || data?.riskLevel) {
        return data?.riskLevel
      }
      return TOKEN_RISK.UNKNOWN
    }
    return undefined
  }, [data, tokenInLists])

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

  if (!isDataLoading) {
    const hasRiskValue = riskLevel && TOKEN_RISK_T[riskLevel]
    if (!hasRiskValue) return null
    return (
      <Flex justifyContent="flex-end">
        <div ref={targetRef} style={{ userSelect: 'none' }}>
          <Tag variant={tagColor}>
            <Text bold small color="invertedContrast">
              {hasRiskValue}
            </Text>
            {tooltipVisible && tooltip}
            <Flex>
              {data?.hasResult ? (
                <HelpIcon ml="4px" width="16px" height="16px" color="invertedContrast" />
              ) : (
                <AutoRenewIcon spin ml="4px" width="20px" height="20px" color="invertedContrast" />
              )}
            </Flex>
          </Tag>
        </div>
      </Flex>
    )
  }

  if (data?.isError) {
    return (
      <Flex justifyContent="flex-end" alignItems="center">
        <div ref={targetRef} style={{ userSelect: 'none' }}>
          <Tag variant="textDisabled">
            <Text bold small color="invertedContrast">
              {t('Unknown')}
            </Text>
            {tooltipVisible && tooltip}
            <Flex>
              <HelpIcon ml="4px" width="16px" height="16px" color="invertedContrast" />
            </Flex>
          </Tag>
        </div>
        <RetryRisk
          onClick={() => refetch()}
          // key for resetting retry state
          key={token.chainId + token.address}
        />
      </Flex>
    )
  }

  return (
    <>
      <Flex justifyContent="flex-end" minWidth={168}>
        <AnimatedButton variant="bubblegum" scale="sm" style={{ height: '28px' }}>
          <Dots style={{ fontSize: '14px' }}>{t('Scanning Risk')}</Dots>
        </AnimatedButton>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          {data?.riskLevel === TOKEN_RISK.UNKNOWN ? (
            <AutoRenewIcon spin ml="4px" width="20px" height="20px" color="textSubtle" />
          ) : (
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default AccessRisk
