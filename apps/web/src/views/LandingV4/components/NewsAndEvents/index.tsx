import { useTranslation } from '@pancakeswap/localization'
import { Box, PageSection, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopLeft } from 'views/Home/components/WedgeSvgs'
import { AllBlog } from 'views/LandingV4/components/NewsAndEvents/AllBlog'
import { Featured } from 'views/LandingV4/components/NewsAndEvents/Featured'

const NewsAndEventsContainer = styled(Box)`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 50px auto;

  @media screen and (min-width: 1440px) {
    padding: 0;
    margin: 80px auto;
  }
`

export const NewsAndEvents = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <>
      <style jsx global>
        {`
          #news-and-events .inner-wedge svg {
            fill: #faf9fa;
          }
          [data-theme='dark'] #news-and-events .inner-wedge svg {
            fill: #000000;
          }
        `}
      </style>
      <PageSection
        id="events"
        index={2}
        hasCurvedDivider={false}
        background={theme.colors.gradientBubblegum}
        containerProps={{ id: 'news-and-events' }}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>

        <NewsAndEventsContainer>
          <Text
            bold
            mb="40px"
            textAlign="center"
            lineHeight={['32px', '36px', '36px', '40px']}
            fontSize={['28px', '36px', '36px', '40px']}
          >
            {t('News And Events')}
          </Text>
          <Featured />
          <AllBlog />
        </NewsAndEventsContainer>
      </PageSection>
    </>
  )
}
