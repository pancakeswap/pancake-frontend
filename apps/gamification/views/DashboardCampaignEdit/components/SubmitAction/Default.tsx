import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CalenderIcon, Flex, Text, VolumeIcon } from '@pancakeswap/uikit'

interface DefaultProps {
  isPublish: boolean
  handleSubmit: () => void
}

export const Default: React.FC<React.PropsWithChildren<DefaultProps>> = ({ isPublish, handleSubmit, children }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection="column">
      <>
        {isPublish ? (
          <Box>
            <Box mb="24px">
              <Text as="span" bold color="textSubtle">
                {t('The campaign status will be set as “Ongoing”,')}
              </Text>
              <Text as="span" color="textSubtle" ml="4px">
                {t('because the dates you entered when creating the campaign are the same as the current ones.')}
              </Text>
            </Box>
            <Box mb="24px">
              <Text as="span" bold color="warning">
                {t('You won’t be able to cancel the campaign and withdraw the reward back.')}
              </Text>
            </Box>
          </Box>
        ) : (
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
                {t(
                  'You won’t be able to cancel the campaign and withdraw the reward back once it is set as “Ongoing”.',
                )}
              </Text>
            </Box>
          </Box>
        )}
      </>
      {children}
      <Button
        width="100%"
        variant="secondary"
        endIcon={
          isPublish ? (
            <VolumeIcon color="invertedContrast" width={20} height={20} />
          ) : (
            <CalenderIcon color="invertedContrast" width={20} height={20} />
          )
        }
        onClick={handleSubmit}
      >
        {isPublish ? t('Publish') : t('Schedule')}
      </Button>
    </Flex>
  )
}
