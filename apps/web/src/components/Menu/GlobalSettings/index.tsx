import { ButtonProps, CogIcon, Flex, IconButton, useModal } from '@pancakeswap/uikit'

import { SettingsModalV2 } from './SettingsModalV2'

type Props = {
  color?: string
  mr?: string
  mode?: string
} & ButtonProps

const GlobalSettings = ({ color, mr = '8px', mode, ...rest }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModalV2 mode={mode} />)

  return (
    <Flex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
        {...rest}
      >
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
