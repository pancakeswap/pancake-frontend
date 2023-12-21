import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'

import SettingsModal from './SettingsModal'
import { useGlobalSettingsEvaluation } from '../hooks/useGlobalSettingsEvaluation'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  useGlobalSettingsEvaluation()

  return (
    <Flex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
      >
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
