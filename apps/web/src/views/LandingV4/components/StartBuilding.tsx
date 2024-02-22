import { Trans, useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Image, LinkExternal, PageSection, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeBottomRight, WedgeTopLeft } from 'views/Home/components/WedgeSvgs'

const HeaderTitle = styled(Box)`
  width: 100%;
  margin: auto auto 40px auto;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 320px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
`

const StepImage = styled(Box)`
  width: 204px;
  height: 154px;
  border: solid 1px;
  border-radius: 24px;
  margin-bottom: 24px;
  background-size: cover;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 282px;
    height: 209px;
  }
`

const StepsContainer = styled(Flex)`
  width: 204px;
  margin: auto;
  flex-wrap: wrap;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 588px;
  }

  @media screen and (min-width: 1440px) {
    width: 1200px;
  }
`

const BuildingConfig = [
  {
    title: <Trans>Read the White Paper</Trans>,
    iconUrl: '/images/v4-landing/step1.png',
    imageUrl: '/images/v4-landing/step1.png',
  },
  {
    title: <Trans>Get the Tools</Trans>,
    iconUrl: '/images/v4-landing/step2.png',
    imageUrl: '/images/v4-landing/step1.png',
  },
  {
    title: <Trans>Join the Community</Trans>,
    iconUrl: '/images/v4-landing/step3.png',
    imageUrl: '/images/v4-landing/step1.png',
  },
  {
    title: <Trans>Start Building</Trans>,
    iconUrl: '/images/v4-landing/step4.png',
    imageUrl: '/images/v4-landing/step1.png',
  },
]

export const StartBuilding = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <>
      <style jsx global>
        {`
          #start-build .inner-wedge svg {
            fill: #faf9fa;
          }
          [data-theme='dark'] #start-build .inner-wedge svg {
            fill: #000000;
          }
        `}
      </style>
      <PageSection
        index={2}
        hasCurvedDivider={false}
        background={theme.colors.gradientCardHeader}
        containerProps={{ id: 'start-build' }}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <Box padding={['0 16px', '0 16px', '0 16px', '0']}>
          <HeaderTitle>
            <Text
              bold
              as="span"
              color="secondary"
              lineHeight={['32px', '36px', '36px', '40px']}
              fontSize={['28px', '36px', '36px', '40px']}
            >
              {t('Start Building')}
            </Text>
            <Text
              bold
              as="span"
              ml="4px"
              lineHeight={['32px', '36px', '36px', '40px']}
              fontSize={['28px', '36px', '36px', '40px']}
            >
              {t('with PancakeSwap v4')}
            </Text>
          </HeaderTitle>
          <StepsContainer>
            {BuildingConfig.map((build) => (
              <Flex flexDirection="column" alignItems="center" key={build.iconUrl}>
                <StepImage style={{ backgroundImage: `url(${build.imageUrl})` }} />
                <Image width={34} height={40} src={build.iconUrl} />
                <LinkExternal
                  external
                  m={[
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 24px 0',
                    '8px 0 0 0',
                  ]}
                  href="https://"
                >
                  {build.title}
                </LinkExternal>
              </Flex>
            ))}
          </StepsContainer>
        </Box>
        <OuterWedgeWrapper>
          <InnerWedgeWrapper>
            <WedgeBottomRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
      </PageSection>
    </>
  )
}
