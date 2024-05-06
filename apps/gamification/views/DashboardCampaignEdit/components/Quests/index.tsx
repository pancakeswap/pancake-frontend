import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { EmptyQuest } from 'views/DashboardCampaignEdit/components/Quests/EmptyQuest'

export const Quests = () => {
  const { t } = useTranslation()

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
        >
          {t('Assign a new quest')}
        </Button>
      </Flex>
      <EmptyQuest />
    </Box>
  )
}
