import React from 'react'
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import GlobalSettingsModal from './GlobalSettingsModal'

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<GlobalSettingsModal />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" mr="8px">
        <CogIcon height={22} width={22} color="textSubtle" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
