import { ButtonProps, CogIcon, Flex, IconButton, useModal } from '@pancakeswap/uikit'

import { useCallback } from 'react'
import SettingsModal from './SettingsModal'
import { SettingsModalV2 } from './SettingsModalV2'
import { SettingsMode } from './types'

type Props = {
  color?: string
  mr?: string
  mode?: SettingsMode
  overrideButton?: (onClick: () => void) => React.ReactNode
} & ButtonProps

const GlobalSettings = ({ color, mr = '8px', mode = SettingsMode.GLOBAL, overrideButton, ...rest }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  const [onPresentSettingsV2Modal] = useModal(<SettingsModalV2 mode={mode} />)

  const onButtonClick = useCallback(() => {
    if (mode === SettingsMode.GLOBAL) onPresentSettingsModal()
    else onPresentSettingsV2Modal()
  }, [mode, onPresentSettingsModal, onPresentSettingsV2Modal])

  return (
    <Flex>
      {overrideButton?.(onButtonClick) || (
        <IconButton
          onClick={onButtonClick}
          variant="text"
          scale="sm"
          mr={mr}
          id={`open-settings-dialog-button-${mode}`}
          {...rest}
        >
          <CogIcon height={24} width={24} color={color || 'textSubtle'} />
        </IconButton>
      )}
    </Flex>
  )
}

export default GlobalSettings
