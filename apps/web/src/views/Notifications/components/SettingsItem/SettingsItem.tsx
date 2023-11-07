import { Box, Flex, Row, Text, Toggle } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { Scope } from 'views/Notifications/types'

interface ISettingsprops {
  scope: Scope
  id: string
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

interface ISettingsContainerProps {
  scopes: NotifyClientTypes.ScopeMap
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

const Settingsitem = ({ scope, id, setScopes }: ISettingsprops) => {
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
    <Box paddingLeft="24px" paddingRight="16px" paddingBottom="8px">
      <Row flexDirection="column" alignItems="flex-start">
        <Text fontWeight="bold" fontSize="16px" textAlign="left" lineHeight="16px">
          {scope.name}
        </Text>
      </Row>
      <Flex justifyContent="space-between" alignItems="center">
        <Text maxWidth="80%" color="textSubtle" lineHeight="24px">
          {scope.description}
        </Text>
        <Toggle id="toggle-expert-mode-button" scale="md" checked={scope.enabled} onChange={toggleScopeEnabled} />
      </Flex>
    </Box>
  )
}

const SettingsContainer = ({ scopes, setScopes }: ISettingsContainerProps) => {
  return (
    <NotificationContainerStyled>
      {Object.entries(scopes).map(([id, scope]) => {
        return <Settingsitem key={id} id={id} scope={scope} setScopes={setScopes} />
      })}
    </NotificationContainerStyled>
  )
}

export default SettingsContainer
