import { BoxProps, CogIcon, Flex, IconButton, useModal } from '@pancakeswap/uikit'
import { SettingsModal } from './SettingsModal'

export function SettingsButton({ mr, color }: Pick<BoxProps, 'mr' | 'color'>) {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" id="open-settings-dialog-button" mr={mr}>
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}
