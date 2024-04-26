import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Button, FlexGap, Modal, ModalV2 } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FilterOption, OPTIONS } from './FilterOption'
import { Filter, FilterValue, Gauges, OptionsType } from './type'

type FilterModalProps = {
  isOpen: boolean
  onDismiss: () => void
  type: OptionsType | null
  options: Filter
  onChange: (type: OptionsType, value: FilterValue) => void
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onDismiss, type, options, onChange }) => {
  const { t } = useTranslation()

  if (!type) return null

  const allSelected = options[type]?.length === OPTIONS[type].options.length
  const allOptionValues = options[type] as Array<unknown>

  return (
    <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
      <Modal title={OPTIONS[type].title} headerBackground="gradientCardHeader">
        <FlexGap flexDirection="column" gap="8px">
          {OPTIONS[type].options.map((option: Gauges | ChainId | FeeAmount) => {
            const checked = allOptionValues.includes(option)
            return (
              <FilterOption type={type} key={String(option)} option={option} checked={checked} onChange={onChange} />
            )
          })}
          <Button
            variant="secondary"
            onClick={() => {
              onChange(type, OPTIONS[type].options)
            }}
          >
            {allSelected ? t('Unselect All') : t('Select All')}
          </Button>
          <Button variant="primary" onClick={onDismiss}>
            {t('Done')}
          </Button>
        </FlexGap>
      </Modal>
    </ModalV2>
  )
}
