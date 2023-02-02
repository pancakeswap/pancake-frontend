import { Flex, Text, Heading, PageSection, Image } from '@pancakeswap/uikit'
import { useTranslation, Trans } from '@pancakeswap/localization'
import GradientLogo from 'views/Home/components/GradientLogoSvg'
import useTheme from 'hooks/useTheme'

const BenefitsList = [
  {
    title: <Trans>Grow Your Audience</Trans>,
    desc: (
      <Trans>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore
        magna aliqua.
      </Trans>
    ),
    imgUrl: '/images/affiliates-program/grow-your-audience.png',
  },
  {
    title: <Trans>Timely Compensation</Trans>,
    desc: (
      <Trans>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore
        magna aliqua.
      </Trans>
    ),
    imgUrl: '/images/affiliates-program/timely-compensation.png',
  },
  {
    title: <Trans>Networking Events</Trans>,
    desc: (
      <Trans>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore
        magna aliqua.
      </Trans>
    ),
    imgUrl: '/images/affiliates-program/networking-events.png',
  },
]

const Benefits = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection index={1} dividerPosition="top" dividerFill={{ light: theme.colors.background }}>
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <GradientLogo height="36px" width="36px" mb="24px" />
        <Heading textAlign="center" scale="xl">
          {t('Why Join Us?')}
        </Heading>
        <Flex maxWidth={['723px']} flexDirection={['column']}>
          {BenefitsList.map((benefit, index) => (
            <Flex
              mt={['48px']}
              // eslint-disable-next-line react/no-array-index-key
              key={`benefit-${index}`}
              flexDirection={index === 1 ? 'row-reverse' : 'row'}
            >
              <Image width={217.86} height={288.99} src={benefit.imgUrl} alt="" />
              <Flex m={['0 32px']} alignSelf={['center']} flexDirection="column">
                <Text fontSize={['32px']} bold color="secondary" mb="24px">
                  {benefit.title}
                </Text>
                <Text color="textSubtle">{benefit.desc}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </PageSection>
  )
}

export default Benefits
