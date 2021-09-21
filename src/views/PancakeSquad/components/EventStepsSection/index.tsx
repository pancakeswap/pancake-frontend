import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Card, CardBody, Flex, Step, Stepper, StepStatus, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledWaveContainer } from 'views/PancakeSquad/styles'
import useTheme from 'hooks/useTheme'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import EventStepsBottomWave from '../../assets/EventStepsBottomWave'
import EventStepsTopWave from '../../assets/EventStepsTopWave'
import stepsConfigBuilder from './config'
import { StyledBunniesSquadImg, StyledEventStepsSectionContainer } from './styles'
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
  const isMintingFinished =
    dynamicSaleInfo && fixedSaleInfo && fixedSaleInfo.maxSupply === dynamicSaleInfo.totalSupplyMinted
  return (
    <StyledEventStepsSectionContainer flexDirection="column" alignItems="center" py="64px" $isDark={isDark}>
      <StyledWaveContainer top="-13px">
        <EventStepsTopWave />
      </StyledWaveContainer>
      <Text color="invertedContrast" fontSize="40px" mb="64px" bold>
        {t('Sounds great, how can I get one?')}
      </Text>
      <Box mb="170px">
        {isMintingFinished ? (
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize="16px" color="text" textAlign="center" mb="64px">
              {t('The minting period is now over: all 10,000 bunnies have now been minted.')}
              <br />
              {t('Head to the NFT Market to buy!')}
            </Text>
            <Box>
              <Button as={Link} to="/market">
                {t('View market')}
              </Button>
            </Box>
          </Flex>
        ) : (
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
        )}
      </Box>
      <StyledWaveContainer bottom="-3px">
        <Flex justifyContent="center">
          <StyledBunniesSquadImg src="/images/pancakeSquad/squadRow.png" alt="pancake bunnies squad" />
        </Flex>
        <EventStepsBottomWave />
      </StyledWaveContainer>
    </StyledEventStepsSectionContainer>
  )
}

export default EventStepsSection
