import { Box, Flex, Row, Text, Toggle } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Divider from 'components/Divider'
import { Dispatch, SetStateAction, useCallback } from 'react'

interface ISettingsprops {
  scope: NotifyClientTypes.NotifySubscription['scope']
  id: string
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

interface ISettingsContainerProps {
  scopes: NotifyClientTypes.NotifySubscription['scope'][]
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

const Settingsitem = ({ scope, id, setScopes }: ISettingsprops) => {
  const toggleScopeEnabled = useCallback(() => {
    setScopes((prevScopes: NotifyClientTypes.NotifySubscription['scope'][]) => ({
      ...prevScopes,
      [id]: {
        ...prevScopes[id],
        enabled: !prevScopes[id].enabled,
      },
    }))
  }, [setScopes, id])

  return (
    <Box>
      <Row flexDirection="column" mt="4px" alignItems="flex-start">
        <Text fontWeight="bold" fontSize="16px" textAlign="left">
          {scope.name}
        </Text>
      </Row>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
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
    <>
      <Divider />
      <Box maxHeight="360px" overflowY="scroll" paddingX="24px">
        {Object.entries(scopes).map(([id, scope]) => {
          return <Settingsitem key={id} id={id} scope={scope} setScopes={setScopes} />
        })}
      </Box>
    </>
  )
}

export default SettingsContainer
