import { Box, Flex, FlexGap, Row, Text, Toggle } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { Scope, SubsctiptionType } from 'views/Notifications/types'
import Image from 'next/image'

export const ScopeIcon: React.FC<
  { scope: SubsctiptionType } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ scope }: any) => {
  const providerToLogo: { [key: string]: JSX.Element } = {
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
      <Image src="/images/notifications/lottery-scope.svg" alt="lottery-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Prediction]: (
      <Image src="/images/notifications/predictions-scope.svg" alt="prediction-scope" width={40} height={40} />
    ),
    [SubsctiptionType.PriceUpdates]: (
      <Image src="/images/notifications/price-updates-scope.svg" alt="prices-scope" width={40} height={40} />
    ),
    [SubsctiptionType.Promotional]: (
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
      <FlexGap gap="12px" alignItems="center">
        <ScopeIcon scope={id as SubsctiptionType} />
        <Text fontWeight={600} fontSize="17px" textAlign="center" lineHeight="16px">
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
  return (
    <NotificationContainerStyled maxHeight="450px">
      {Object.entries(scopes).map(([id, scope], index) => {
        return <Settingsitem key={id} id={id} scope={scope} setScopes={setScopes} index={index} />
      })}
    </NotificationContainerStyled>
  )
}

export default SettingsContainer
