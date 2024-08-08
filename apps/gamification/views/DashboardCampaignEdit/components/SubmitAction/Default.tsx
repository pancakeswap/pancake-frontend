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
          <Text as="span" bold color="textSubtle">
            {t('The campaign will be set as “Scheduled” and be only visible to you,')}
          </Text>
          <Text as="span" color="textSubtle" ml="4px">
            {t(
              'because the dates you entered when creating the campaign are in the future. You can change or cancel it.',
            )}
          </Text>
        </Box>
        <Box mb="24px">
          <Text as="span" bold color="textSubtle">
            {t('When the dates will be met, the campaign will be set as "Ongoing".')}
          </Text>
          <Text as="span" bold color="warning">
            {t('You won’t be able to cancel the campaign and withdraw the reward back once it is set as “Ongoing”.')}
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
