import { BoxProps, CogIcon, Flex, IconButton, NotificationDot, useModal } from '@pancakeswap/uikit'
import { useIsExpertMode } from 'state/user/expertMode'
import { SettingsModal } from './SettingsModal'

export function SettingsButton({ mr, color }: Pick<BoxProps, 'mr' | 'color'>) {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)
  const isExpertMode = useIsExpertMode()

  return (
    <Flex>
      <NotificationDot show={isExpertMode}>
        <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" id="open-settings-dialog-button" mr={mr}>
          <CogIcon height={24} width={24} color={color || 'textSubtle'} />
        </IconButton>
      </NotificationDot>
    </Flex>
  )
}
