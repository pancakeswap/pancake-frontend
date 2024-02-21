import { Banner } from 'views/LandingV4/components/Banner'
import { ExploreHooks } from 'views/LandingV4/components/ExploreHooks'
import { Features } from 'views/LandingV4/components/Features'
import { NewsAndEvents } from 'views/LandingV4/components/NewsAndEvents'
import { StartBuilding } from 'views/LandingV4/components/StartBuilding'
import { SubMenu } from 'views/LandingV4/components/SubMenu'

export const LandingV4 = () => {
  return (
    <>
      <SubMenu />
      <Banner />
      <Features />
      <StartBuilding />
      <ExploreHooks />
      <NewsAndEvents />
    </>
  )
}
