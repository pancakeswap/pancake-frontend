import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
// import { styled } from 'styled-components'
import { PageSection } from '@pancakeswap/uikit'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopLeft } from 'views/Home/components/WedgeSvgs'

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
        index={2}
        hasCurvedDivider={false}
        background={theme.colors.gradientCardHeader}
        containerProps={{ id: 'news-and-events' }}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        News And Events
      </PageSection>
    </>
  )
}
