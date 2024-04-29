import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Quest } from 'views/Quests/components/Quest'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > a {
    width: 100%;
    margin: auto;

    &:hover {
      text-decoration: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > a {
      width: calc(50% - 8px);
      margin: 0;
    }
  }
`

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
      <StyledFlexGap>
        <Quest />
        <Quest />
        <Quest />
        <Quest />
      </StyledFlexGap>
    </Box>
  )
}
