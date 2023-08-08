import { Trans, useTranslation } from '@pancakeswap/localization'
import { ChainId, ERC20Token, Token } from '@pancakeswap/sdk'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import {
  Button,
  Dots,
  Flex,
  HelpIcon,
  IconButton,
  Link,
  RefreshIcon,
  Tag,
  Text,
  useTooltip,
  promotedGradient,
} from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import { useAllLists } from 'state/lists/hooks'
import styled from 'styled-components'
import useSWRImmutable from 'swr/immutable'
import { fetchRiskToken, TOKEN_RISK } from 'views/Swap/hooks/fetchTokenRisk'

const AnimatedButton = styled(Button)`
  animation: ${promotedGradient} 1.5s ease infinite;
  background-size: 1000% 1000%;
`

interface AccessRiskProps {
  token: ERC20Token
}

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
  return useSWRImmutable(
    token && token.address && token.chainId === ChainId.BSC && ['risk', token.chainId, token.address],
    () => {
      return fetchRiskToken(token.address, token.chainId)
    },
  )
}

const AccessRisk: React.FC<AccessRiskProps> = ({ token }) => {
  const [show] = useUserTokenRisk()

  return show && <AccessRiskComponent token={token} />
}

const TOKEN_RISK_T = {
  [TOKEN_RISK.VERY_LOW]: <Trans>Very Low Risk</Trans>,
  [TOKEN_RISK.LOW]: <Trans>Low Risk</Trans>,
  [TOKEN_RISK.MEDIUM]: <Trans>Medium Risk</Trans>,
  [TOKEN_RISK.HIGH]: <Trans>High Risk</Trans>,
  [TOKEN_RISK.VERY_HIGH]: <Trans>Very High Risk</Trans>,
  [TOKEN_RISK.UNKNOWN]: <Trans>Unknown Risk</Trans>,
} as const

const AccessRiskComponent: React.FC<AccessRiskProps> = ({ token }) => {
  const { t } = useTranslation()

  const { data, mutate, error } = useTokenRisk(token)

  const lists = useAllLists()
  const tokenInLists = useMemo(() => {
    if (!token?.address) return false
    const tokenLists = Object.values(lists)
      .map((list) => list?.current?.tokens)
      .filter(Boolean)
    if (!tokenLists.length) return null
    return tokenLists.some((tokenInfoList) => {
      return tokenInfoList.some((tokenInfo) => tokenInfo.address === token.address)
    })
  }, [lists, token?.address])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text as="span">{t('Risk scan results are provided by a third party')}</Text>
      <Link style={{ display: 'inline' }} ml="4px" external href="https://www.avengerdao.org">
        AvengerDAO
      </Link>
      {tokenInLists || data?.riskLevel > TOKEN_RISK.MEDIUM ? (
        <>
          <Text my="8px">
            {t(
              'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk.',
            )}
          </Text>
          <Flex mt="4px">
            <Text>{t('Learn more about risk rating')}</Text>
            <Link ml="4px" external href="https://www.avengerdao.org/docs/meter/consumer-api/RiskBand">
              {t('here.')}
            </Link>
          </Flex>
        </>
      ) : (
        <>
          <Text ml="4px" as="span">
            {t('is reporting a risk level of')} <b>{TOKEN_RISK_T[data?.riskLevel] || 'Unknown'}</b>
          </Text>
          <Text mt="4px">
            {t(
              'However, this token has been labelled Unknown Risk due to not being listed on any of the built-in token lists.',
            )}
          </Text>
          <Flex mt="4px">
            <Text bold>{t('Please proceed with caution and always do your own research.')}</Text>
          </Flex>
        </>
      )}
    </>,
    { placement: 'bottom' },
  )

  const riskLevel = useMemo(() => {
    if (!isUndefinedOrNull(data?.riskLevel)) {
      if (tokenInLists || data.riskLevel > TOKEN_RISK.MEDIUM) {
        return data.riskLevel
      }
      return TOKEN_RISK.UNKNOWN
    }
    return undefined
  }, [data, tokenInLists])

  if (data) {
    const hasRiskValue = TOKEN_RISK_T[riskLevel]
    if (!hasRiskValue) return null
    return (
      <Flex justifyContent="flex-end">
        <div ref={targetRef} style={{ userSelect: 'none' }}>
          <Tag variant={data.riskLevel > TOKEN_RISK.MEDIUM ? 'failure' : !tokenInLists ? 'textDisabled' : 'primary'}>
            <Text bold small color="invertedContrast">
              {hasRiskValue}
            </Text>
            {tooltipVisible && tooltip}
            <Flex>
              <HelpIcon ml="4px" width="16px" height="16px" color="invertedContrast" />
            </Flex>
          </Tag>
        </div>
      </Flex>
    )
  }

  if (error) {
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
          onClick={() => mutate()}
          // key for resetting retry state
          key={token.chainId + token.address}
        />
      </Flex>
    )
  }

  return (
    <>
      <Flex justifyContent="flex-end">
        <AnimatedButton variant="bubblegum" scale="sm" style={{ textTransform: 'uppercase', height: '28px' }}>
          <Dots style={{ fontSize: '14px' }}>{t('Scanning Risk')}</Dots>
        </AnimatedButton>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
    </>
  )
}

export default AccessRisk
