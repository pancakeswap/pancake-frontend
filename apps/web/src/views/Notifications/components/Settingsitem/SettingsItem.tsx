import { Box, Flex, Row, Text, Toggle } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Divider from 'components/Divider'
import { Dispatch, SetStateAction, useCallback } from 'react'

interface ISettingsprops {
  title: string
  description: string
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
  isSubscribed: {
    description: string
    enabled: boolean
  }
}

interface ISettingsContainerProps {
  scopes: NotifyClientTypes.NotifySubscription['scope']
  setScopes: Dispatch<SetStateAction<NotifyClientTypes.ScopeMap>>
}

const Settingsitem = ({ title, description, isSubscribed, setScopes }: ISettingsprops) => {
  const toggleScopeEnabled = useCallback(() => {
    setScopes((prevScopes) => ({
      ...prevScopes,
      [title]: {
        ...prevScopes[title],
        enabled: !prevScopes[title].enabled,
      },
    }))
  }, [setScopes, title])

  return (
    <Box>
      <Row flexDirection="column" mt="8px" alignItems="flex-start">
        <Text fontWeight="bold" fontSize="16px" textAlign="left">
          {title}
        </Text>
      </Row>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text maxWidth="80%" color="textSubtle">
          {description}
        </Text>
        <Toggle
          id="toggle-expert-mode-button"
          scale="md"
          checked={isSubscribed.enabled}
          onChange={toggleScopeEnabled}
        />
      </Flex>
    </Box>
  )
}

const SettingsContainer = ({ scopes, setScopes }: ISettingsContainerProps) => {
  return (
    <>
      <Divider />
      <Box maxHeight="360px" overflowY="scroll" paddingX="24px">
        {Object.entries(scopes).map(([title, scope]) => {
          return (
            <Settingsitem
              key={title}
              title={title}
              description={scope.description}
              isSubscribed={scope}
              setScopes={setScopes}
            />
          )
        })}
      </Box>
    </>
  )
}

export default SettingsContainer
