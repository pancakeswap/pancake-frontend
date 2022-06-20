import Link from 'next/link'
import { Box, Button, Card, CardBody, Flex, Step, Stepper, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledWaveContainer, LandingBodyWrapper } from 'views/PancakeSquad/styles'
import useTheme from 'hooks/useTheme'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import EventStepsBottomWave from '../../assets/EventStepsBottomWave'
import EventStepsTopWave from '../../assets/EventStepsTopWave'
import stepsConfigBuilder from './config'
import { StyledBunniesSquadImg, StyledEventStepsSectionContainer } from './styles'
import { EventStepsProps } from './types'

const EventStepsSection: React.FC<EventStepsProps> = ({ eventInfos, userInfos, isLoading, userStatus, account }) => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()
  const { balance: cakeBalance } = useGetCakeBalance()
  const stepsConfig = stepsConfigBuilder({ t, eventInfos, userInfos, userStatus, account, theme, cakeBalance })
  const isMintingFinished = userInfos && eventInfos && eventInfos.maxSupply === eventInfos.totalSupplyMinted
  return (
    <StyledEventStepsSectionContainer justifyContent="center" $isDark={isDark}>
      <StyledWaveContainer top="-13px">
        <EventStepsTopWave isDark={isDark} />
      </StyledWaveContainer>
      <LandingBodyWrapper flexDirection="column" alignItems="center" py="64px">
        <Text color="invertedContrast" textAlign="center" fontSize="40px" mb="64px" bold>
          {t('Sounds great, how can I get one?')}
        </Text>
        <Box mb={['80px', null, null, '170px']}>
          {isMintingFinished ? (
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="16px" color="text" textAlign="center">
                {t('The minting period is now over: all 10,000 bunnies have now been minted.')}
              </Text>
              <Text fontSize="16px" color="text" textAlign="center" mb="64px">
                {t('Head to the NFT Marketplace to buy!')}
              </Text>
              <Box>
                <Link href="/nfts" passHref>
                  <Button as="a">{t('View market')}</Button>
                </Link>
              </Box>
            </Flex>
          ) : (
            <Stepper>
              {stepsConfig.map((step, index) => (
                <Step
                  key={step.id}
                  index={index}
                  statusFirstPart={step.status}
                  statusSecondPart={stepsConfig[index + 1]?.status}
                >
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
      </LandingBodyWrapper>
      <StyledWaveContainer bottom="-3px">
        <Flex justifyContent="center">
          <StyledBunniesSquadImg src="/images/pancakeSquad/squadRow.png" alt="pancake bunnies squad" />
        </Flex>
        <EventStepsBottomWave isDark={isDark} />
      </StyledWaveContainer>
    </StyledEventStepsSectionContainer>
  )
}

export default EventStepsSection
