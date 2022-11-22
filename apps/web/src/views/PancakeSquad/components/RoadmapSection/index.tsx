import { Text, Heading, Card, CardHeader, CardBody, CircleOutlineIcon, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LandingBodyWrapper } from '../../styles'
import config from './config'

const FaqSection = () => {
  const { t } = useTranslation()

  return (
    <LandingBodyWrapper>
      <LandingBodyWrapper>
        <Flex flexDirection="column">
          <Heading scale="xl" color="secondary" display="block">
            {t('Roadmap')}
          </Heading>
          <Flex flexDirection="column">
            {config({ t }).map((roadblock) => (
              <div style={{ display: 'flex', gap: '24px' }}>
                <div
                  style={{
                    fontSize: '24px',
                    width: '12px',
                    background: 'var(--colors-gradientCardHeader)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      borderRadius: '50%',
                      background: 'var(--colors-gradientCardHeader)',
                      minWidth: '42px',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateX(-50%) translateX(6px)',
                    }}
                  >
                    {roadblock.icon}
                  </span>
                </div>
                <Card marginY="8px" style={{ flexGrow: '1' }}>
                  <CardHeader>
                    <Heading scale="lg" color="secondary">
                      {roadblock.title}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    {roadblock.description.map((description) => (
                      <Text>🍦{description}</Text>
                    ))}
                    <Text textAlign="end" fontStyle="italic" color="textSubtle">
                      {roadblock.reached}
                    </Text>
                  </CardBody>
                </Card>
              </div>
            ))}
          </Flex>
        </Flex>
      </LandingBodyWrapper>
    </LandingBodyWrapper>
  )
}

export default FaqSection
