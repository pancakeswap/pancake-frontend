import { Trans, useTranslation } from '@pancakeswap/localization'
import { Box, Flex, LinkExternal, PageSection, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeBottomRight, WedgeTopLeft } from 'views/Home/components/WedgeSvgs'
import { Step1Icon } from './Icons/Step1Icon'
import { Step2Icon } from './Icons/Step2Icon'
import { Step3Icon } from './Icons/Step3Icon'
import { Step4Icon } from './Icons/Step4Icon'

const HeaderTitle = styled(Box)`
  width: 100%;
  margin: auto auto 40px auto;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 320px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 528px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
  }
`

const StepImage = styled(Box)`
  width: 204px;
  height: 154px;
  margin-bottom: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 252px;
    height: 201px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 204px;
    height: 154px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 282px;
    height: 188px;
  }
`

const StepsContainer = styled(Flex)`
  width: 204px;
  margin: auto;
  flex-wrap: wrap;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 528px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 818px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1200px;
  }
`

const BuildingConfig = [
  {
    title: <Trans>Read the Whitepaper</Trans>,
    icon: <Step1Icon width={40} height={48} color="primary" />,
    imageUrl: `${ASSET_CDN}/web/v4-landing/buildings-1.png`,
    url: 'https://github.com/pancakeswap/pancake-v4-core/blob/main/docs/whitepaper-en.pdf?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4whitepaper',
  },
  {
    title: <Trans>Get the Tools</Trans>,
    icon: <Step2Icon width={40} height={48} color="primary" />,
    imageUrl: `${ASSET_CDN}/web/v4-landing/buildings-2.png`,
    url: 'https://github.com/pancakeswap/pancake-v4-hooks-template?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4hookstemplate',
  },
  {
    title: <Trans>Join the Community</Trans>,
    icon: <Step3Icon width={40} height={48} color="primary" />,
    imageUrl: `${ASSET_CDN}/web/v4-landing/buildings-3.png`,
    url: 'https://discord.gg/pancakeswap?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4landingpage',
  },
  {
    title: <Trans>Start Building</Trans>,
    icon: <Step4Icon width={40} height={48} color="primary" />,
    imageUrl: `${ASSET_CDN}/web/v4-landing/buildings-4.png`,
    url: 'https://developer.pancakeswap.finance/?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4landingpage',
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
        id="building"
        index={2}
        hasCurvedDivider={false}
        background={theme.colors.gradientBubblegum}
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
              <Flex flexDirection="column" alignItems="center" key={build.imageUrl}>
                <StepImage style={{ backgroundImage: `url(${build.imageUrl})` }} />
                {build.icon}
                <LinkExternal
                  external
                  bold
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
                  href={build.url}
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
