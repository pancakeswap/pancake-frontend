import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Flex, Text, useModal } from '@pancakeswap/uikit'
// import { EmptyQuest } from 'views/DashboardCampaignEdit/components/Quests/EmptyQuest'
import { ChooseQuestModal } from 'views/DashboardCampaignEdit/components/Quests/ChooseQuestModal'
import { QuestList } from 'views/DashboardCampaignEdit/components/Quests/QuestList'

export const Quests = () => {
  const { t } = useTranslation()
  const [onPressChooseQuestModal] = useModal(<ChooseQuestModal />)

  return (
    <Box position="relative" zIndex="0">
      <Flex mb="16px" justifyContent="space-between">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Quests')}
        </Text>
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
        {/* <Button
          padding="0"
          variant="text"
          height="fit-content"
          style={{ alignSelf: 'center' }}
          endIcon={<PencilIcon width={13} color="primary" />}
        >
          {t('Edit')}
        </Button> */}
      </Flex>
      {/* <EmptyQuest /> */}
      <QuestList />
    </Box>
  )
}
