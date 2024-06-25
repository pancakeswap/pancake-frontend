import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Flex, PencilIcon, Text, useModal } from '@pancakeswap/uikit'
import { ChooseQuestModal } from 'views/DashboardCampaignEdit/components/Quests/ChooseQuestModal'
// import { EmptyQuest } from 'views/DashboardCampaignEdit/components/Quests/EmptyQuest'
// import { QuestList } from 'views/DashboardCampaignEdit/components/Quests/QuestList'
import { useCampaignEdit } from 'views/DashboardCampaignEdit/context/useCampaignEdit'

export const Quests = () => {
  const { t } = useTranslation()
  const { state, updateValue } = useCampaignEdit()
  const { pickedQuests } = state
  const [onPressChooseQuestModal] = useModal(
    <ChooseQuestModal pickedQuests={pickedQuests} updatePickedQuests={updateValue} />,
  )

  return (
    <Box position="relative" zIndex="0">
      <Flex mb="16px" justifyContent="space-between">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Quests')}
        </Text>
        {pickedQuests.length ? (
          <Button
            padding="0"
            variant="text"
            height="fit-content"
            style={{ alignSelf: 'center' }}
            endIcon={<PencilIcon width={13} color="primary" />}
            onClick={onPressChooseQuestModal}
          >
            {t('Edit')}
          </Button>
        ) : (
          <Button
            padding="0"
            variant="text"
            height="fit-content"
            style={{ alignSelf: 'center' }}
            endIcon={<AddIcon color="primary" />}
            onClick={onPressChooseQuestModal}
          >
            {t('Assign a new quest')}
          </Button>
        )}
      </Flex>
      {/* {pickedQuests.length ? <QuestList pickedQuests={pickedQuests} /> : <EmptyQuest />} */}
    </Box>
  )
}
