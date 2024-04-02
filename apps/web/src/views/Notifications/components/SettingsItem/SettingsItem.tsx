import { Box, Flex, FlexGap, Text, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Image from 'next/image'
import React, { Dispatch, ReactNode, SetStateAction, useCallback } from 'react'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { Scope, SubsctiptionType } from 'views/Notifications/types'

export const ScopeIcon: React.FC<
  { scope: SubsctiptionType } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ scope }: any) => {
  const providerToLogo: { [key: string]: ReactNode } = {
    [SubsctiptionType.Alerts]: (
      <Image src="/images/notifications/alerts-scope.svg" alt="alert-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Farms]: (
      <Image src="/images/notifications/farms-scope.svg" alt="farms-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Liquidity]: (
      <Image src="/images/notifications/liquidity-scope.svg" alt="liquidity-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Lottery]: (
      <Image src="/images/notifications/lotto-scope.svg" alt="lottery-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Prediction]: (
      <Image src="/images/notifications/predictions-scope.svg" alt="prediction-scope" width={40} height={40} />
    ),
    [SubsctiptionType.PriceUpdates]: (
      <Image src="/images/notifications/predictions-scope.svg" alt="prices-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Promotional]: (
      <Image src="/images/notifications/promotional-scope.svg" alt="promo-scope" width={40} height={40} />
    ),
    [SubsctiptionType.TradingReward]: (
      <Image src="/images/notifications/promotional-scope.svg" alt="promo-scope" width={40} height={40} />
    ),
  }
  const logo = providerToLogo[scope]
  return logo
}

interface ISettingsprops {
  scope: Scope
  id: string
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
  index: number
}

interface ISettingsContainerProps {
  scopes: NotifyClientTypes.ScopeMap
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

const Settingsitem = ({ scope, id, setScopes, index }: ISettingsprops) => {
  const toggleScopeEnabled = useCallback(() => {
    setScopes((prevScopes: NotifyClientTypes.ScopeMap) => ({
      ...prevScopes,
      [id]: {
        ...prevScopes[id],
        enabled: !prevScopes[id].enabled,
      },
    }))
  }, [setScopes, id])

  return (
    <Box paddingLeft="24px" paddingRight="16px" paddingBottom="16px">
      <FlexGap alignItems="center">
        <ScopeIcon scope={id as SubsctiptionType} />
        <Text fontWeight={600} paddingX="12px" fontSize="17px" textAlign="center" lineHeight="16px">
          {scope.name}
        </Text>
      </FlexGap>
      <Flex
        marginTop="6px"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={index === 6 ? '' : '1px solid'}
        borderBottomColor="cardBorder"
        paddingBottom="16px"
      >
        <Text maxWidth="80%" color="textSubtle">
          {scope.description}
        </Text>
        <Toggle id="toggle-expert-mode-button" scale="md" checked={scope.enabled} onChange={toggleScopeEnabled} />
      </Flex>
    </Box>
  )
}

const SettingsContainer = ({ scopes, setScopes }: ISettingsContainerProps) => {
  const { isMobile } = useMatchBreakpoints()
  const mobileHeight = window?.document.documentElement.clientHeight * 0.9
  return (
    <NotificationContainerStyled $maxHeight={isMobile ? `${mobileHeight - 150}px` : '550px'}>
      {Object.entries(scopes)
        .sort(([, scopeA], [, scopeB]) => {
          if (scopeA.name === 'alerts' || scopeA.name === 'Liquidity') return -1
          if (scopeB.name === 'alerts' || scopeB.name === 'Liquidity') return 1
          return 0
        })
        .map(([id, scope], index) => {
          return <Settingsitem key={id} id={id} scope={scope} setScopes={setScopes} index={index} />
        })}
    </NotificationContainerStyled>
  )
}

export default SettingsContainer
