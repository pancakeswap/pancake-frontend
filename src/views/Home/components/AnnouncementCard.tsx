import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Text, LinkExternal } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Tweet } from 'react-twitter-widgets'

const TwitterContainer = () => {
  return (
    <section className='twitterContainer'>
      <div className='twitter-embed' style={{
        maxHeight: '320px',
        overflow: 'scroll',
      }}>
        <Tweet
          options={{
            width: '100%',
            height: '100%',
            theme: 'dark',
          }}
          tweetId='1413144215026995215'
        />
      </div>
    </section>
  )
}

const StyledAnnouncementCard = styled(Card)`
  background-size: 300px 300px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`

const AnnouncementCard = () => {
  const { t } = useTranslation()

  return (
    <StyledAnnouncementCard>
      <CardBody>
        <Heading size='xl' mb='24px'>
          {t('Announcements')}
        </Heading>
        <Text>
          {t('Spawning Pools are live! Earn partner project tokens and a limited time NFT.')}
        </Text>
        <br/>
        <image width="100%" >
          <img src="https://storage.googleapis.com/rug-zombie/gorillafi-small.gif" alt="silverback"/>
        </image>

        <LinkExternal paddingTop="10px" href="https://twitter.com/rugzombie">
          Follow our twitter for latest announcements
        </LinkExternal>
      </CardBody>
    </StyledAnnouncementCard>
  )
}

export default AnnouncementCard
