import { useTranslation } from '@pancakeswap/localization'
import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  FlexGap,
  LinkExternal,
  Modal,
  ModalV2,
  RiskAlertIcon,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { useEffect, useMemo, useState } from 'react'
import { keyframes, styled } from 'styled-components'

import { useUserSlippage } from '@pancakeswap/utils/user'
import { DEFAULT_SLIPPAGE_TOLERANCE } from 'components/Menu/GlobalSettings/TransactionSettings'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TOKEN_RISK, TOKEN_RISK_T, useTokenRisk } from './index'

const appearAni = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0px); }
`
const RiskDetailsPanelWrapper = styled(FlexGap)`
  opacity: 0;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.card};
  padding: 12px;
  animation: ${appearAni} 0.25s ease-in-out 0.5s forwards;
`
const RiskModalDetailCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`

const StyledLinkExternal = styled(LinkExternal).attrs({ color: 'primary60' })`
  font-weight: normal;
`

const StyledTextButton = styled(Button).attrs({ variant: 'text' })`
  color: ${({ theme }) => theme.colors.primary60};
  font-weight: normal;
`

interface RiskInputPanelDisplayProps {
  token?: ERC20Token
}

interface RiskDetailsProps {
  token?: ERC20Token
  riskLevelDescription?: string
  isInputToken?: boolean
}

interface RiskDetailsPanelProps {
  token0?: ERC20Token
  token0RiskLevelDescription?: string
  token1?: ERC20Token
  token1RiskLevelDescription?: string
  isPriceImpactTooHigh?: boolean
  isSlippageTooHigh?: boolean
}

interface RiskDetailsModalProps {
  isOpen?: boolean
  onDismiss?: () => void
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
      return 'destructive60'
    }
    if (data.riskLevel >= TOKEN_RISK.LOW && data.riskLevel <= TOKEN_RISK.MEDIUM) {
      return 'yellow'
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
        <Text ml="2px" fontSize="12px" color={tagColor}>
          {TOKEN_RISK_T[riskLevel]}
        </Text>
      </FlexGap>
    )
  return null
}

export const RiskTitle: React.FC<RiskDetailsProps> = ({ token, isInputToken }) => {
  const { t } = useTranslation()
  const { isDataLoading, riskLevel, tagColor } = useRiskCheckData(token)
  if (!isDataLoading && riskLevel && riskLevel <= TOKEN_RISK.SIGNIFICANT && riskLevel >= TOKEN_RISK.MEDIUM) {
    if (riskLevel && riskLevel >= TOKEN_RISK.VERY_LOW && token?.address) {
      return (
        <FlexGap alignItems="flex-start" gap="8px">
          <Box>
            <RiskAlertIcon width={24} color={tagColor} />
          </Box>
          <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
            <Text fontSize="16px" bold>
              {TOKEN_RISK_T[riskLevel]}{' '}
              {t('detected for %tokenType% token:', {
                tokenType: isInputToken ? t('input') : t('output'),
              })}{' '}
              {token?.symbol}
            </Text>
          </FlexGap>
        </FlexGap>
      )
    }
    return null
  }
  return null
}

export const PriceImpactTitle: React.FC = () => {
  const { t } = useTranslation()
  return (
    <FlexGap alignItems="flex-start" gap="8px">
      <Box>
        <WarningIcon width={24} color="destructive60" />
      </Box>
      <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
        <Text fontSize="16px" bold>
          {t('Price impact too high. Proceed with caution.')}
        </Text>
      </FlexGap>
    </FlexGap>
  )
}

export const SlippageTitle: React.FC = () => {
  const { t } = useTranslation()
  return (
    <FlexGap alignItems="flex-start" gap="8px">
      <Box>
        <WarningIcon width={24} color="destructive60" />
      </Box>
      <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
        <Text fontSize="16px" bold>
          {t('Slippage settings too high. Proceed with caution.')}
        </Text>
      </FlexGap>
    </FlexGap>
  )
}

const PriceImpactDetails: React.FC = () => {
  const { t } = useTranslation()
  return (
    <FlexGap alignItems="flex-start">
      <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
        <Text>
          {t(
            'Final execution price may be differ from the market price due to trader size, available liquidity, and trading route. Please proceed with caution.',
          )}
        </Text>
      </FlexGap>
    </FlexGap>
  )
}

const SlippageDetails: React.FC = () => {
  const { t } = useTranslation()
  const [, setUserSlippageTolerance] = useUserSlippage()

  return (
    <FlexGap alignItems="flex-start">
      <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
        <Text>
          {t(
            'You may only get the amount of “Minimum received” with a high slippage setting. Reset your slippage to avoid potential losses.',
          )}
        </Text>
        <StyledTextButton onClick={() => setUserSlippageTolerance(DEFAULT_SLIPPAGE_TOLERANCE)} scale="sm" px="0">
          {t('Reset Slippage')}
        </StyledTextButton>
      </FlexGap>
    </FlexGap>
  )
}

export const RiskDetails: React.FC<RiskDetailsProps> = ({ token, riskLevelDescription }) => {
  const { t } = useTranslation()
  const { isDataLoading, riskLevel } = useRiskCheckData(token)
  const { chainId } = useActiveChainId()

  if (!isDataLoading && riskLevel && riskLevel <= TOKEN_RISK.SIGNIFICANT && riskLevel >= TOKEN_RISK.MEDIUM) {
    if (riskLevel && riskLevel >= TOKEN_RISK.VERY_LOW && token?.address) {
      return (
        <FlexGap alignItems="flex-start" gap="8px">
          <FlexGap justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
            <Text>
              {riskLevelDescription ||
                t(
                  'The address contains risk factors that are possible to lead to partial loss of funds, or medium to lower chance of catastrophic losses.',
                )}
            </Text>
            <StyledLinkExternal href="https://www.hashdit.io">{t('Result provided by HashDit')}</StyledLinkExternal>
            {chainId === ChainId.BSC && (
              <StyledLinkExternal external href={`https://dappbay.bnbchain.org/risk-scanner/${token.address}`}>
                {t('Get more details from RedAlarm')}
              </StyledLinkExternal>
            )}
          </FlexGap>
        </FlexGap>
      )
    }
    return null
  }
  return null
}

export const useShouldRiskPanelDisplay = (token0?: ERC20Token, token1?: ERC20Token) => {
  const { isDataLoading: isDataLoading0, riskLevel: riskLevel0 } = useRiskCheckData(token0)
  const { isDataLoading: isDataLoading1, riskLevel: riskLevel1 } = useRiskCheckData(token1)
  if ((isDataLoading0 && token0) || (isDataLoading1 && token1)) {
    return false
  }
  return (
    (riskLevel0 && riskLevel0 <= TOKEN_RISK.SIGNIFICANT && riskLevel0 >= TOKEN_RISK.MEDIUM) ||
    (riskLevel1 && riskLevel1 <= TOKEN_RISK.SIGNIFICANT && riskLevel1 >= TOKEN_RISK.MEDIUM)
  )
}

export const RiskDetailsPanel: React.FC<RiskDetailsPanelProps> = ({
  token0,
  token1,
  token0RiskLevelDescription,
  token1RiskLevelDescription,
  isPriceImpactTooHigh,
  isSlippageTooHigh,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isRiskToken0 = useShouldRiskPanelDisplay(token0)
  const isRiskToken1 = useShouldRiskPanelDisplay(token1)
  const isRiskMoreThanOne = useMemo(() => {
    let count = 0
    if (isRiskToken0) {
      count++
    }
    if (isRiskToken1) {
      count++
    }
    if (isPriceImpactTooHigh) {
      count++
    }
    if (isSlippageTooHigh) {
      count++
    }
    return count > 1
  }, [isRiskToken0, isRiskToken1, isPriceImpactTooHigh, isSlippageTooHigh])
  useEffect(() => {
    if (isRiskMoreThanOne) {
      setIsOpen(false)
    }
  }, [isRiskMoreThanOne])
  return (
    <>
      <RiskDetailsPanelWrapper width="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <SwapUIV2.Collapse
          isOpen={isOpen}
          recalculateDep={isRiskMoreThanOne}
          onToggle={isRiskMoreThanOne ? () => setModalOpen(true) : () => setIsOpen(!isOpen)}
          title={
            <FlexGap flexDirection="column">
              <RiskTitle token={token0} isInputToken />
              <RiskTitle token={token1} isInputToken={false} />
              {isPriceImpactTooHigh && <PriceImpactTitle />}
              {isSlippageTooHigh && <SlippageTitle />}
            </FlexGap>
          }
          content={
            <FlexGap flexDirection="column" pl="32px" pr="8px">
              <RiskDetails token={token0} riskLevelDescription={token0RiskLevelDescription} />
              <RiskDetails token={token1} riskLevelDescription={token1RiskLevelDescription} />
              {isPriceImpactTooHigh && <PriceImpactDetails />}
              {isSlippageTooHigh && <SlippageDetails />}
            </FlexGap>
          }
        />
      </RiskDetailsPanelWrapper>
      <RiskDetailsModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <FlexGap flexDirection="column" gap="16px">
          {isRiskToken0 && (
            <RiskModalDetailCardWrapper>
              <RiskTitle token={token0} isInputToken />
              <RiskDetails token={token0} riskLevelDescription={token0RiskLevelDescription} />
            </RiskModalDetailCardWrapper>
          )}
          {isRiskToken1 && (
            <RiskModalDetailCardWrapper>
              <RiskTitle token={token1} isInputToken={false} />
              <RiskDetails token={token1} riskLevelDescription={token1RiskLevelDescription} />
            </RiskModalDetailCardWrapper>
          )}
          {isPriceImpactTooHigh && (
            <RiskModalDetailCardWrapper>
              <PriceImpactTitle />
              <PriceImpactDetails />
            </RiskModalDetailCardWrapper>
          )}
          {isSlippageTooHigh && (
            <RiskModalDetailCardWrapper>
              <SlippageTitle />
              <SlippageDetails />
            </RiskModalDetailCardWrapper>
          )}
        </FlexGap>
      </RiskDetailsModal>
    </>
  )
}

export const RiskDetailsModal: React.FC<React.PropsWithChildren<RiskDetailsModalProps>> = ({
  isOpen,
  onDismiss,
  children,
}) => {
  const { t } = useTranslation()
  return (
    <ModalV2 isOpen={isOpen} closeOnOverlayClick onDismiss={onDismiss}>
      <Modal title={t('Note for this swap')} hideCloseButton maxWidth={[null, null, null, '480px']}>
        {children}
      </Modal>
    </ModalV2>
  )
}
