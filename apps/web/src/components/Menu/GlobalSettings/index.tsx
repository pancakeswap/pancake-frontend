import { ButtonProps, CogIcon, Flex, IconButton, ModalV2, useModalV2 } from '@pancakeswap/uikit'

import { SettingsModalV2 } from './SettingsModalV2'
import { SettingsMode } from './types'

type Props = {
  color?: string
  mr?: string
  mode?: SettingsMode
  overrideButton?: (onClick: () => void) => React.ReactNode
} & ButtonProps

const GlobalSettings = ({ color, mr = '8px', mode = SettingsMode.GLOBAL, overrideButton, ...rest }: Props) => {
  const { isOpen, setIsOpen, onDismiss } = useModalV2()

  const openModal = () => setIsOpen(true)

  return (
    <Flex>
      {overrideButton?.(openModal) || (
        <IconButton
          onClick={openModal}
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
        <SettingsModalV2 onDismiss={onDismiss} mode={mode} />
      </ModalV2>
    </Flex>
  )
}

export default GlobalSettings
