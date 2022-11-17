import { CogIcon, Flex, IconButton, useModal } from '@pancakeswap/uikit'
import { SettingsModal } from './SettingsModal'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

export function SettingsButton({ color, mr = '8px', mode }: Props) {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" id={`open-settings-dialog-button-${mode}`} mr={mr}>
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}
