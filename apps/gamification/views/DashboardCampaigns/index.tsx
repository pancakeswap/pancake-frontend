import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { defaultValueChains } from 'components/NetworkMultiSelector'
import { useState } from 'react'
import { Records } from 'views/DashboardCampaigns/components/Records'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'

export const DashboardCampaigns = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(CompletionStatusIndex.ONGOING)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<ChainId>>(defaultValueChains)

  return (
    <RecordTemplate
      title={t('Campaigns')}
      createLink="/dashboard/campaign/edit"
      createButtonText={t('Create')}
      statusButtonIndex={statusButtonIndex}
      pickMultiSelect={pickMultiSelect}
      setPickMultiSelect={setPickMultiSelect}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
