import styled from 'styled-components'
import { PageSection } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import AffiliatesBanner from 'views/AffiliatesProgram/HomePage/AffiliatesBanner'

const StyledBannerSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const AffiliatesProgram = () => {
  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }
        `}
      </style>
      <PageMeta />
      <StyledBannerSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <AffiliatesBanner />
      </StyledBannerSection>
    </>
  )
}

export default AffiliatesProgram
