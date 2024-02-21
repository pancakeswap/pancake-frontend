import { useTranslation } from '@pancakeswap/localization'
import { Box, PageSection } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeBottomRight, WedgeTopLeft } from 'views/Home/components/WedgeSvgs'

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
        <Box>Start Building</Box>
        <OuterWedgeWrapper>
          <InnerWedgeWrapper>
            <WedgeBottomRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
      </PageSection>
    </>
  )
}
