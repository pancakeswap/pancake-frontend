import { useTranslation } from '@pancakeswap/localization'
import { TooltipText } from '@pancakeswap/uikit'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'

export const LockCakeDataSet = () => {
  const { t } = useTranslation()
  return (
    <DataBox gap="8px">
      <DataHeader />
      <DataRow label={t('CAKE to be locked')} value="1,438.45" />
      <DataRow
        label={
          <Tooltips content={t('@todo')}>
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('Unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value="1,438.45"
      />
    </DataBox>
  )
}
