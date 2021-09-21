import React from 'react'
import { Box, Card, CardBody, Step, Stepper, StepStatus, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledWaveContainer } from 'views/PancakeSquad/styles'
import useTheme from 'hooks/useTheme'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import EventStepsBottomWave from '../../assets/EventStepsBottomWave'
import EventStepsTopWave from '../../assets/EventStepsTopWave'
import stepsConfigBuilder from './config'
import { StyledEventStepsSectionContainer } from './styles'
import { EventStepsProps } from './types'

const EventStepsSection: React.FC<EventStepsProps> = ({
  fixedSaleInfo,
  dynamicSaleInfo,
  isLoading,
  userStatus,
  account,
}) => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()
  const { balance: cakeBalance } = useGetCakeBalance()
  const stepsConfig = stepsConfigBuilder({ t, fixedSaleInfo, dynamicSaleInfo, userStatus, account, theme, cakeBalance })
  return (
    <StyledEventStepsSectionContainer flexDirection="column" alignItems="center" py="64px" $isDark={isDark}>
      <StyledWaveContainer top="-13px">
        <EventStepsTopWave />
      </StyledWaveContainer>
      <Text color="invertedContrast" fontSize="40px" mb="64px" bold>
        {t('Sounds great, how can I get one?')}
      </Text>
      <Stepper>
        {stepsConfig.map((step, index) => (
          <Step key={step.id} index={index} status={step.status as StepStatus}>
            <Card>
              <CardBody>
                <Box maxWidth="388px">
                  <Text color="secondary" fontSize="20px" mb="16px" bold>
                    {step.title}
                  </Text>
                  {step.bodyText.map((text) => (
                    <Text key={text} color="textSubtle" mb="16px">
                      {text}
                    </Text>
                  ))}
                  {isLoading ? null : step.buttons}
                </Box>
              </CardBody>
            </Card>
          </Step>
        ))}
      </Stepper>
      <StyledWaveContainer bottom="-3px">
        <EventStepsBottomWave />
      </StyledWaveContainer>
    </StyledEventStepsSectionContainer>
  )
}

export default EventStepsSection
