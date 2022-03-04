import React from 'react'
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  mr?: string
}

const GlobalSettings = ({ color, mr = '8px' }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)
  const handleClick = () => {
    console.log('🚀 ~ file: index.tsx ~ line 15 ~ handleClick ~ handleClick')
    onPresentSettingsModal()
  }
  return (
    <Flex>
      <IconButton onClick={handleClick} variant="text" scale="sm" mr={mr} id="open-settings-dialog-button">
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
