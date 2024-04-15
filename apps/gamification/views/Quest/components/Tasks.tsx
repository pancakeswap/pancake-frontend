import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Tag, Text } from '@pancakeswap/uikit'

export const Tasks = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        <Box style={{ alignSelf: 'center' }}>
          <Tag variant="secondary" outline>
            1/6 completed
          </Tag>
          <Tag variant="textDisabled" outline>
            6
          </Tag>
          <Tag variant="success" outline>
            {t('Completed')}
          </Tag>
        </Box>
      </Flex>
    </Box>
  )
}
