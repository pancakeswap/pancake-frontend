import { RowBetween, Text, IconButton, PencilIcon, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { SettingsModal } from '../../Menu/Settings/SettingsModal'

export default function SlippageSection() {
  const { t } = useTranslation()

  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  const [allowedSlippage] = useUserSlippage() // custom from users

  return (
    <RowBetween>
      <Text bold fontSize="12px" color="secondary">
        {t('Slippage Tolerance')}
        <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
          <PencilIcon color="primary" width="10px" />
        </IconButton>
      </Text>
      <Text bold color="primary">
        {allowedSlippage / 100}%
      </Text>
    </RowBetween>
  )
}
