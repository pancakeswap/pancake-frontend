import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Toggle } from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import Divider from 'components/Divider'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface ISettingsprops {
  title: string
  description: string
  isToastVisible: boolean
  account: string
  isSubscribed: {
    description: string
    enabled: boolean
  }
  setScopes: Dispatch<SetStateAction<PushClientTypes.ScopeMap>>
}

const Settingsitem = ({ title, description, isSubscribed, setScopes }: ISettingsprops) => {
  const { t } = useTranslation()

  const toggleScopeEnabled = () => {
    setScopes((prevScopes) => ({
      ...prevScopes,
      [title]: {
        ...prevScopes[title],
        enabled: !prevScopes[title].enabled,
      },
    }))
  }

  return (
    <>
      <Flex flexDirection="column" mt="8px">
        <Text fontWeight="bold" fontSize="16px">
          {t(`${title}`)}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Flex alignItems="center" maxWidth="80%">
          <Text color="textSubtle">{t(`${description}`)}</Text>
        </Flex>
        <Toggle
          id="toggle-expert-mode-button"
          scale="md"
          checked={isSubscribed.enabled}
          onChange={toggleScopeEnabled}
        />
      </Flex>
    </>
  )
}

const SettingsContainer = ({
  account,
  scopes,
  setScopes,
}: {
  account: string
  scopes: PushClientTypes.ScopeMap
  setScopes: Dispatch<SetStateAction<PushClientTypes.ScopeMap>>
}) => {
  const [isToastVisible, setToastVisible] = useState<boolean>(false)

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isToastVisible) {
      const hideToastTimer = setTimeout(() => {
        setToastVisible(false)
      }, 5000)

      return () => {
        clearTimeout(hideToastTimer)
      }
    }
  }, [isToastVisible])
  return (
    <>
      <Box>
        <Divider />
        {Object.entries(scopes).map(([title, scope]) => {
          return (
            <Settingsitem
              key={title}
              title={title}
              description={scope.description}
              isToastVisible={isToastVisible}
              account={account}
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
