import { ButtonProps, CogIcon, Flex, IconButton, ModalV2, useModal, useModalV2 } from '@pancakeswap/uikit'

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

  // For SettingsModalV2
  const { isOpen, setIsOpen, onDismiss } = useModalV2()

  const onButtonClick = useCallback(() => {
    if (mode === SettingsMode.GLOBAL) onPresentSettingsModal()
    else setIsOpen(true)
  }, [mode, setIsOpen, onPresentSettingsModal])

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

      <ModalV2 isOpen={isOpen} onDismiss={onDismiss} closeOnOverlayClick>
        <SettingsModalV2 onDismiss={onDismiss} />
      </ModalV2>
    </Flex>
  )
}

export default GlobalSettings
