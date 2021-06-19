import React from 'react'
import Page from 'components/layout/Page'
import HomeCopy from '../HomeCopy'


const Home: React.FC = () => {

  return (
      <Page>
        {/* <Hero>
          <Heading as="h1" size="xl" mb="24px" color="secondary">
            <img alt="" src={ImageURL} style={{ width: "250px" }} />
            <Text>{t('Bringing your rugged tokens back from the dead.')}</Text>
          </Heading>
        </Hero>
        <div>
          <Cards>
            <GraveStakingCard />
            <AnnouncementCard />
          </Cards>
          <Cards>
            <ZmbeStats />
            <TotalValueLockedCard />
          </Cards>
        </div> */}
        <HomeCopy />
      </Page>
  )
}

export default Home
