import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CalenderIcon, Flex, Text } from '@pancakeswap/uikit'

interface DefaultProps {
  handleSubmit: () => void
}

export const Default: React.FC<React.PropsWithChildren<DefaultProps>> = ({ handleSubmit, children }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection="column">
      <Box>
        <Box mb="24px">
          <Text as="span" color="textSubtle">
            {t('The quest will be scheduled and set to')}
          </Text>
          <Text as="span" bold color="textSubtle" ml="4px">
            {t("'Scheduled,'")}
          </Text>
          <Text as="span" color="textSubtle" ml="4px">
            {t('which will be visible only to')}
          </Text>
          <Text as="span" bold color="textSubtle" ml="4px">
            {t("'You',")}
          </Text>
          <Text as="span" color="textSubtle" ml="4px">
            {t(
              'as the dates entered for the quest are in the future. You will have the option to modify or cancel it before the scheduled start date.',
            )}
          </Text>
        </Box>
        <Box mb="24px">
          <Text as="span" color="textSubtle">
            {t('Once the scheduled time arrives, the quest will transition to')}
          </Text>
          <Text as="span" bold color="textSubtle" ml="4px">
            {t("'Ongoing.'")}
          </Text>
          <Text as="span" bold color="warning" ml="4px">
            {t(
              "Please note that once the quest is active, the quest can't be canceled, and rewards can't be withdrawn.",
            )}
          </Text>
        </Box>
      </Box>
      {children}
      <Button
        width="100%"
        variant="secondary"
        endIcon={<CalenderIcon color="primary" width={20} height={20} />}
        onClick={handleSubmit}
      >
        {t('Schedule')}
      </Button>
    </Flex>
  )
}
