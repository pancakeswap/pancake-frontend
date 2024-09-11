import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Tag, Text } from '@pancakeswap/uikit'
// import { Quest } from 'views/Quests/components/Quest'

export const QuestList = () => {
  const { t } = useTranslation()

  return (
    <Box m="32px 0">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Quests')}
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
      {/* <StyledFlexGap>
        <Quest />
      </StyledFlexGap> */}
    </Box>
  )
}
