import { Flex, Text, Button, Box, PageSection } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import Calculator from 'views/AffiliatesProgram/Overview/Calculator'

const RewardCalculate = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection
      index={1}
      dividerPosition="top"
      concaveDivider
      background={theme.colors.gradientBubblegum}
      clipFill={{ light: theme.colors.gradientBubblegum }}
    >
      <Flex>
        <Flex width={['447px']} alignSelf={['center']} flexDirection="column">
          <Text fontSize={['20px']} color="secondary">
            Rewards calculator
          </Text>
          <Box m={['32px 0']}>
            <Text fontSize={['40px']} lineHeight="110%" color="body" bold>
              More friends,
            </Text>
            <Text fontSize={['40px']} lineHeight="110%" color="body" bold>
              More volume,
            </Text>
            <Text fontSize={['40px']} lineHeight="110%" color="body" bold>
              higher the rewards
            </Text>
          </Box>
          <Text color="textSubtle" mb="32px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Button width="fit-content">Apply now!</Button>
        </Flex>
        <Calculator />
      </Flex>
    </PageSection>
  )
}

export default RewardCalculate
